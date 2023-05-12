import { HandlerTools } from "@iote/cqrs";
import { Query } from "@ngfi/firestore-qbuilder";
import { FunctionContext, FunctionHandler } from "@ngfi/functions";

import * as firebaseTools from 'firebase-tools';

import { FAccount } from '@app/model/finance/accounts/main';
import { BankTransaction } from '@app/model/finance/payments';
import { PontoConnection } from "@app/model/finance/banking/ponto";
import { BankConnectionAccountType } from "@app/model/finance/banking";

import { PontoConnectUtilityService } from "../../base/ponto-util.service";
import { PontoConnectOnboardingService } from "../services/ponto-connect-onboarding.service";

const ACCOUNTS_REPO = (orgId: string) => `orgs/${orgId}/accounts`;
const BANK_ACCOUNT_CONNECTIONS_REPO = (orgId: string) =>  `orgs/${orgId}/bank-connections`;
const BANK_ACCOUNT_TRANSACTIONS_REPO = (orgId: string) =>  `orgs/${orgId}/bank-transactions`;
const PONTO_ACCOUNT_TRANSACTIONS_REPO = (orgId: string) =>  `orgs/${orgId}/ponto-transactions`;

/**
 *
 * @export
 * @class DisconnectPontoHandler
 * @extends {FunctionHandler<{ orgId: string, bankAccountId: string }, boolean>}
 *
 * @description Disconnects a ponto bank account and switches back to manual accounting.
 *
 * Step 1. Fetch Ponto or Create Bank connection for this org
 *
 * Step 2. Delete Bank transactions linked to the Ponto Account
 *
 * Step 3. Delete Ponto Bank User Access
 *
 * Step 4. Delete Ponto Bank Connection
 *
 * Step 5. Update bank account
 *
 * Step 6. Revoke Ponto Integration
 *
 */
export class DisconnectPontoHandler extends FunctionHandler<{ orgId: string, sysAccountId: string }, boolean>
{
  public async execute(data: { orgId: string, sysAccountId: string }, context: FunctionContext, tools: HandlerTools)
  {
    tools.Logger.log(() => `[DisconnectPontoHandler].execute: Setting ponto details for account: ${ data.sysAccountId } on org ${ data.orgId }`);

    // Step 1. Fetch Ponto Bank connection for this org
    const _bankConnectionRepo = tools.getRepository<PontoConnection>(BANK_ACCOUNT_CONNECTIONS_REPO(data.orgId));
    const query = new Query().where('type', '==', BankConnectionAccountType.Ponto);
    const connections = await _bankConnectionRepo.getDocuments(query);
    const pontoConnection: PontoConnection = connections.length > 0 ? connections[0] : null as any;

    const account: any = pontoConnection.accounts.find(acc => acc.sysAccId === data.sysAccountId);

    if(!account)
    {
      tools.Logger.log(() => `[DisconnectPontoHandler].execute: No ponto account found corresponding to the account Id: ${ account?.bankAccId }`);
      return false;
    }

    // Step 2. Delete bank transactions linked to the Ponto Account
    const _bankTrsRepo = tools.getRepository<BankTransaction>(BANK_ACCOUNT_TRANSACTIONS_REPO(data.orgId));
    const _pontoTrsRepo = tools.getRepository<BankTransaction>(PONTO_ACCOUNT_TRANSACTIONS_REPO(data.orgId));
    const pontoTrs = await _pontoTrsRepo.getDocuments(new Query());

    const accTrs = pontoTrs.filter(tr => tr.to === data.sysAccountId || tr.from === data.sysAccountId);

    const deletions$ = accTrs.map(tr => _pontoTrsRepo.delete(tr?.id!));
    const deletions2$ = accTrs.map(tr => _bankTrsRepo.delete(tr?.id!));

    tools.Logger.log(() => `[DisconnectPontoHandler].execute: Deleting ${ accTrs.length } transactions`);

    await Promise.all(deletions$.concat(deletions2$));

    // Fetch bank user access before deletion
    let userAccess;
    try{
      const _utilityService = new PontoConnectUtilityService(tools.Logger);
      tools.Logger.log(() => `[DisconnectPontoHandler].execute: Fetching user access.`);
      userAccess = await _utilityService.getPontoUserAccess(data.orgId, data.sysAccountId);
    } catch(err) {
      tools.Logger.log(() => `[DisconnectPontoHandler].execute: User access error ${JSON.stringify(err)}.`);
    }

    // Step 3. Delete Ponto Bank Connection
    // TODO update GCLoud project
    tools.Logger.log(() => `[DisconnectPontoHandler].execute: Deleting ponto account with bankAccId: ${ account.bankAccId }`);
    const path = BANK_ACCOUNT_CONNECTIONS_REPO(data.orgId) + `/${pontoConnection.id}`;
      await firebaseTools.firestore
                    .delete(path, {
                      project: '',
                      recursive: true,
                      yes: true,
                      force: true
                    });
    tools.Logger.log(() => `[DisconnectPontoHandler].execute: Deleted ponto bank connection completely`);

    // Step 4. Update bank account
    tools.Logger.log(() => `[DisconnectPontoHandler].execute: Resetting orgAccount ${ account.sysAccId } back to manual accounting.`);
    const _orgAccountsRepo = tools.getRepository<FAccount>(ACCOUNTS_REPO(data.orgId));
    const orgAcc = await _orgAccountsRepo.getDocumentById(account.sysAccId);

    if(!orgAcc)
    {
      tools.Logger.log(() => `[DisconnectPontoHandler].execute: No org account found corresponding to the account Id: ${ account.sysAccId }`);
      return false;
    }

    orgAcc.bankConnection = BankConnectionAccountType.None;
    _orgAccountsRepo.update(orgAcc);
    tools.Logger.log(() => `[DisconnectPontoHandler].execute: orgAccount ${ account.sysAccId } has been reset back to manual accounting.`);

    // Step 5. Revoke Ponto Integration (Might cause error in case the access tokens had been messed up via race conditions).
    try{
      tools.Logger.log(() => `[DisconnectPontoHandler].execute: Revoking ponto account integration.`);
      const onboardingService = new PontoConnectOnboardingService(tools.Logger);

      if(!userAccess?.access_token){
        tools.Logger.error(() => `[DisconnectPontoHandler].execute: Error! User access is invalid: ${ JSON.stringify(userAccess) }.`);
        return true;
      }

      await onboardingService.revokeIntegration(userAccess.access_token);
    } catch(err){
      tools.Logger.log(() => `[DisconnectPontoHandler].execute: Error when disconnecting org ${data.orgId}. Possible issue with the access code`);
      tools.Logger.log(() => `[DisconnectPontoHandler].execute: ${ JSON.stringify(err)}`);
    }

    tools.Logger.log(() => `[DisconnectPontoHandler].execute: Disconnect process completed.`);
    return true;
  }
}
