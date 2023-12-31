import { HandlerTools } from "@iote/cqrs";
import { Query } from "@ngfi/firestore-qbuilder";
import { FunctionContext, FunctionHandler } from "@ngfi/functions";

import { Organisation } from "@app/model/organisation";
import { BankConnection, BankConnectionAccount } from "@app/model/finance/banking";

import { __PubSubPublishAction } from "@app/functions/pubsub";
import { FAccount } from "@app/model/finance/accounts/main";

const BANK_ACCOUNT_CONNECTIONS_REPO = (orgId: string) =>  `orgs/${orgId}/bank-connections`;

/**
 * @class SetSelectedBankAccountHandler
 *
 * @description Updates the org's FAccount with new bank account details, and
 * adds the new bank account to the list of bank connection accounts
 *
 * Step 1. Trigger switch to bank payments function to clear any existing manual payments.
 *
 * Step 2. Update Kujali FAccount
 *
 * Step 3. Update Bank connection
 *
 * Step 4. Perform initial transactions fetch
 *
 * @returns PontoConnection
 *
 */
export class SetSelectedBankAccountHandler extends FunctionHandler<{ newBankAccount: BankConnectionAccount, orgId: string }, BankConnection>
{

  public async execute(data: { newBankAccount: BankConnectionAccount, orgId: string }, context: FunctionContext, tools: HandlerTools)
  {
    tools.Logger.log(() => `[SetSelectedBankAccountHandler].execute: Organisation: ${data.orgId}. New Bank account: ${ JSON.stringify(data.newBankAccount) }`);

    // Step 1. Get corresponding Kujali Account from Org Object

    const _accRepo = tools.getRepository<FAccount>(`orgs/${data.orgId}/accounts`);
    const account = await _accRepo.getDocumentById(data.newBankAccount.sysAccId);

    tools.Logger.log(() => `[SetSelectedBankAccountHandler].execute: Selected account: ${account.id}}`);

    // Step 2. Update Kujali FAccount
    tools.Logger.log(() => `[SetSelectedBankAccountHandler].execute: Updating iban for account: ${ account.name }.`);
    account.bic = data.newBankAccount.bic;
    account.iban = data.newBankAccount.iban;
    account.bankConnection = data.newBankAccount.type;
    
    await _accRepo.update(account);

    // Step 3. Add newly-linked bank account to this connection's list of accounts and update Bank connection
    const _bankConnectionRepo = tools.getRepository<BankConnection>(BANK_ACCOUNT_CONNECTIONS_REPO(data.orgId));
    let query = new Query().where('type', '==', data.newBankAccount.type);
    const connections = await _bankConnectionRepo.getDocuments(query);
    let bankConnection: BankConnection = connections.length > 0 ? connections[0] : null as any;

    tools.Logger.log(() => `[SetSelectedBankAccountHandler].execute: Adding new bank account to connection: ${ bankConnection.name }.`);
    bankConnection.accounts.push(data.newBankAccount);
    delete (bankConnection as any).userAccess;
    const conn = await _bankConnectionRepo.update(bankConnection);

    // Step 4. Perform initial transactions fetch
    const fetchTrsPayload = { orgId: data.orgId, orgAccId: account.id};
    await __PubSubPublishAction<{ orgId: string}>('fetchPontoUserBankTransactionsPubsub', fetchTrsPayload);

    return conn;
  }
}
