import { FunctionContext, FunctionHandler } from "@ngfi/functions";
import { Query } from "@ngfi/firestore-qbuilder";
import { HandlerTools } from "@iote/cqrs";
import { __DateToStorage } from '@iote/time';

import * as moment from 'moment';

import { __PubSubPublishAction } from "@app/functions/pubsub";

import { PontoAccountService } from "@app/functions/api/finance/banking/ponto-connect";

import { PontoConnection } from '@app/model/finance/banking/ponto';

import { ACCOUNT_BANK_ACCOUNTS_REPO, ACCOUNT_BANK_CONNECTIONS_REPO, PROP_ACCOUNT_BALANCES_REPO } from '@app/model/data/repos';

import { PaymentBase, PaymentSources, WritePaymentCommand } from "@app/model/finance/payments";

import { PropertyAccountBalance } from '@app/model/accounting/acc-balance';

import { BankConnection, BankConnectionAccount, BankConnectionAccountType } from "@app/model/finance/banking";

// import { __Fractional } from '@app/model/common';

import { FAccount } from '@app/model/finance/accounts/main';

import { DbMethods } from "@app/model/finance/payments";

import { FTransactionTypes } from "@app/model/finance/payments";

// import { SwanAccount, UpdateSwanAccDataCmd } from "@app/model/accounting/banking/swan";

/**
 * @class MatchBankBalanceHandler
 * @extends {FunctionHandler<{ propId: string, accId: string }, void>}
 *
 * @param propId: Property Id
 * @param accId: The org account id whose balance needs to be updated.
 * @param lang: The language to be used for the description of the generated tr.
 *
 * // Step 1. Get corresponding Kujali Account
 *
 * // Step 2. Get bank connection from database
 *
 * // Step 3. Get bank balance from respective bank
 *
 * // Step 4. Get current prop balance
 *
 * // Step 5. Get difference and create the counter transaction
 *
 */
export class MatchBankBalanceHandler extends FunctionHandler<{ propId: string, accId: string, lang: 'en' | 'fr' | 'nl' }, string>
{
  public async execute(data: { propId: string, accId: string, lang: 'en' | 'fr' | 'nl' }, context: FunctionContext, tools: HandlerTools)
  {
    tools.Logger.log(() => `[MatchBankBalanceHandler].execute: PropId: ${data.propId} Data: ${JSON.stringify(data)}.`);

    // Step 1. Get corresponding Kujali Account
    const _accRepo = tools.getRepository<FAccount>(`orgs/${data.propId}/accounts`);
    const account = await _accRepo.getDocumentById(data.accId);

    if(!account)
    {
      tools.Logger.log(() => `[MatchBankBalanceHandler].execute: No account matching id ${data.accId} on org ${data.propId}.`);
      return;
    }
    tools.Logger.log(() => `[MatchBankBalanceHandler].execute: Found account with id ${data.accId} on org ${data.propId}.`);

    // Step 2. Get bank connection from database
    const _bankConnectionRepo = tools.getRepository<BankConnection>(ACCOUNT_BANK_CONNECTIONS_REPO(data.propId));
    const query = new Query().where('id', '==', data.accId);
    const connections = await _bankConnectionRepo.getDocuments(query);
    const bankConnection: BankConnection = connections.length > 0 ? connections[0] : null;
    const bankAccount = bankConnection?.accounts.find(acc => acc.sysAccId === data.accId);

    if(!bankConnection)
    {
      tools.Logger.log(() => `[MatchBankBalanceHandler].execute: No bank connection matching sysAccId ${data.accId} on org ${data.propId}.`);
      return;
    }
    tools.Logger.log(() => `[MatchBankBalanceHandler].execute: Found bank connection with id ${data.accId} PropId: ${data.propId}.`);

    // Step 3. Get bank balance from respective bank
    tools.Logger.log(() => `[MatchBankBalanceHandler].execute: Fetching bank account balance.`);
    const bankAccBalance: number = await this._getBankBalance(account.bankConnection, bankConnection, bankAccount, context, tools);

    // Step 4. Get current prop balance
    const _propBalanceRepo = tools.getRepository<PropertyAccountBalance>(PROP_ACCOUNT_BALANCES_REPO(data.propId));
    const balances = await _propBalanceRepo.getDocuments(new Query().orderBy("createdOn", "desc") .limit(1));
    const propBalance = balances.length > 0 ? balances[0] : null;
    const s4yAccBalance: number = propBalance[data.accId] ?? 0;

    tools.Logger.log(() => `[MatchBankBalanceHandler].execute: Current Prop Balance ${ s4yAccBalance }.`);
    tools.Logger.log(() => `[MatchBankBalanceHandler].execute: Current Bank Balance ${ bankAccBalance }.`);

    // Step 5. Get difference and create the counter transaction
    const difference = __Fractional(bankAccBalance - s4yAccBalance);

    if(difference)
    {
      tools.Logger.log(() => `[MatchBankBalanceHandler].execute: Difference: ${difference}.`);
      const mode = difference > 0 ? 'credit' : 'debit';
      const payment = this._createCounterPayment(account, bankAccount, Math.abs(difference), mode, data.lang);
      return await this._addPayment(data.propId, payment);
    }
  }

  private async _getBankBalance(
    bankConnectionType: BankConnectionAccountType,
    bankConnection: BankConnection, bankAccount: BankConnectionAccount,
    context: FunctionContext, tools: HandlerTools
  ){
    switch(bankConnectionType)
    {
      case BankConnectionAccountType.Ponto:
        tools.Logger.log(() => `[MatchBankBalanceHandler].execute: Fetching Ponto bank account balance.`);
        return this._getPontoBankBalance(bankConnection, bankAccount, context, tools);

        case BankConnectionAccountType.Swan:
          tools.Logger.log(() => `[MatchBankBalanceHandler].execute: Fetching Swan bank account balance.`);
          return await this._getSwanBankBalance(bankConnection, bankAccount, tools);
        default:
          tools.Logger.log(() => `[MatchBankBalanceHandler].execute: Account type is unsupported. Returning 0 as bank balance`);
        return 0;
    }
  }

  private async _getPontoBankBalance(
    bankConnection: BankConnection, bankAccount: BankConnectionAccount,
    context: FunctionContext, tools: HandlerTools
  ){
    // Get ponto acount balance
    const pontoConnection = bankConnection as PontoConnection;
    // Fetch and update user access code
    const _pontoAccountService = new PontoAccountService(tools.Logger);

    tools.Logger.log(() => `[MatchBankBalanceHandler].execute: Fetching user access.`);
    const userAccess = await _pontoAccountService._utilityService.getPontoUserAccess(pontoConnection.propId, pontoConnection.id);

    if(!userAccess?.access_token){
      tools.Logger.error(() => `[MatchBankBalanceHandler].execute: Error! User access is invalid: ${ JSON.stringify(userAccess) }.`);
      return;
    }
    tools.Logger.log(() => `[MatchBankBalanceHandler].execute: Fetched user access: ${ JSON.stringify(userAccess) }.`);

    return await _pontoAccountService.getAccBalance(userAccess.access_token, bankAccount.bankAccId);
  }

  private async _getSwanBankBalance(
    bankConnection: BankConnection,
    bankAccount: BankConnectionAccount,
    tools: HandlerTools
  ){
    // Trigger account details fetch to get latest account balance data
    const payload: UpdateSwanAccDataCmd = {
      bankConnectionId: bankConnection.id,
      propId: bankConnection.propId
    }
    tools.Logger.log(() => `[MatchBankBalanceHandler].execute: Calling updateSwanAccDataPubsub PubSub.`);
    await __PubSubPublishAction<UpdateSwanAccDataCmd>('updateSwanAccDataPubsub', payload);

    tools.Logger.log(() => `[MatchBankBalanceHandler].execute: Fetching bank balance from repo.`);
    const _bankAccountsRepo  = tools.getRepository<SwanAccount>(ACCOUNT_BANK_ACCOUNTS_REPO(bankConnection.propId, bankConnection?.id));
    const swanAcc = await _bankAccountsRepo.getDocumentById(bankAccount?.bankAccId);
    const bookedBalance = parseFloat(swanAcc?.balances?.booked?.value) ?? 0;

    return bookedBalance;
  }

  /** Creates the counter transaction to match the org balance to the current bank balance */
  private _createCounterPayment(acc: FAccount, bankAcc: BankConnectionAccount, difference: number, mode: 'credit' | 'debit', lang: 'en' | 'fr' | 'nl'): PaymentBase
  {
    const tr: PaymentBase = {
      amount: difference,
      type: FTransactionTypes.PaymentBase,
      date: __DateToStorage(moment(), true),
      notes: this.getLabel(lang),
      verified: true,
      verificationDate:  __DateToStorage(moment(), true),
      for: [],

      from:        mode === 'debit'  ? acc.id :  bankAcc.bankAccId,
      fromAccName: mode === 'debit'  ? acc.name : acc.name ?? bankAcc.name,
      to:          mode === 'credit' ? acc.id :  bankAcc.bankAccId,
      toAccName:   mode === 'credit' ? acc.name : acc.name ?? bankAcc.name,

      source: PaymentSources.Manual
    };

    return tr;
  }

  getLabel(lang: 'en' | 'fr' | 'nl'){
    switch(lang){
      case 'en':
        return 'Correct the current balance to match bank account balance';
      case 'fr':
        return "Corrigez le solde actuel pour qu'il corresponde au solde du compte bancaire";
      case 'nl':
        return 'Corrigeer het huidige saldo zodat het overeenkomt met het bankrekeningsaldo';
    }
  }

  /** Delete payment object and trigger related actions, e.g reconciliation creation/deletion*/
  private async _addPayment(propId: string, payment: PaymentBase)
  {
    const data = { propId, payment, method : DbMethods.CREATE } as WritePaymentCommand;

    return __PubSubPublishAction<WritePaymentCommand>('writePaymentPubsub', data);
  }
}
