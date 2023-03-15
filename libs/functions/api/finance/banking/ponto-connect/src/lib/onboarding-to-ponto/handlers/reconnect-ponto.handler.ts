import { HandlerTools } from "@iote/cqrs";
import { FunctionContext, FunctionHandler } from "@ngfi/functions";
import { AdminRepositoryFactory } from "@ngfi/admin-data";

import { chunk } from 'lodash';

import { BankConnectionStatus } from "@app/model/finance/banking";
import { PontoConnection } from "@app/model/finance/banking/ponto";

import { UserAccess } from "../../model/user-access.interface";

import { PontoConnectUtilityService } from "../../base/ponto-util.service";

const BANK_ACCOUNT_CONNECTIONS_REPO = (orgId: string) =>  `orgs/${orgId}/bank-connections`;
const USER_ACCOUNT_ACCESS_REPO = (orgId: string, connectionId: string) =>  `orgs/${orgId}/bank-connections/${connectionId}/access-info`;

/**
 *
 * @export
 * @class ReconnectPontoHandler
 * @extends {FunctionHandler<{ orgId: string, bankAccountId: string }, boolean>}
 *
 * @description Reconnects a ponto bank account that got disconnected via an access_token error
 * and sets Bank Connection status back to Enabled.
 *
 * Step 1. Delete previous User Access objects
 *
 * Step 2. Request new Access token
 *
 * Step 3. Fetch Ponto Bank connection for this org
 *
 * Step 4. Update Bank Connection status
 *
 */
export class ReconnectPontoHandler extends FunctionHandler<{ authCode: string, redirectUrl: string, orgId: string, accountId: string }, void>
{
  public async execute(data: { authCode: string, redirectUrl: string, orgId: string, accountId: string }, context: FunctionContext, tools: HandlerTools)
  {
    tools.Logger.log(() => `execute: Reconnecting ponto account: ${ data.accountId } on org ${ data.orgId }`);

    // Step 1. Delete previous User Access objects
    tools.Logger.log(() => `execute: Deleting previous access tokens: ${ data.accountId } on org ${ data.orgId }`);
    await this.performAccessTokenDeletions(data.orgId, data.accountId);
    tools.Logger.log(() => `execute: Deletion complete.`);

    // Step 2. Request new Access token
    tools.Logger.log(() => `execute: Connecting with new Auth Code: ${ data.authCode }, url: ${ data.redirectUrl }`);
    let userAccess: UserAccess;
    try{
      const _utilityService = new PontoConnectUtilityService(tools.Logger);
      tools.Logger.log(() => `execute: Fetching user access.`);
      userAccess = await _utilityService.getPontoUserAccess(data.orgId, data.accountId, data.authCode, data.redirectUrl);
      tools.Logger.log(() => `execute: New Initial user Access: ${ JSON.stringify(userAccess) } user access.`);
    } catch(err) {
      tools.Logger.log(() => `execute: User access error ${JSON.stringify(err)}.`);
      return;
    }

    if(!userAccess?.access_token){
      tools.Logger.log(() => `execute: User access error. No refresh_token found! ${JSON.stringify(userAccess)}.`);
      return;
    }

    // Step 3. Fetch Ponto Bank connection for this account
    const _bankConnectionRepo = tools.getRepository<PontoConnection>(BANK_ACCOUNT_CONNECTIONS_REPO(data.orgId));
    const pontoConnection = await _bankConnectionRepo.getDocumentById(data.accountId);

    if(!pontoConnection)
    {
      tools.Logger.log(() => `execute: No ponto Connection found corresponding to the account Id: ${ data.accountId }`);
      return;
    }

    // Step 4. Update Ponto Bank connection Status for this account
    tools.Logger.log(() => `execute: Updating ponto connection status: ${ data.accountId }`);
    pontoConnection.status = BankConnectionStatus.ENABLED;
    _bankConnectionRepo.update(pontoConnection);

    tools.Logger.log(() => `execute: Bank Connection successfully updated. Execution complete!`);
  }

  private async performAccessTokenDeletions(orgId: string, accountId: string){
    const MAX_WRITES_PER_BATCH = 500; /** https://cloud.google.com/firestore/quotas#writes_and_transactions */

    const commitBatchPromises: any[] = [];
    const _db = (AdminRepositoryFactory as any).__getStore() as FirebaseFirestore.Firestore;
    const snapshot = await _db.collection(USER_ACCOUNT_ACCESS_REPO(orgId, accountId)).get();

    const batches = chunk(snapshot.docs, MAX_WRITES_PER_BATCH);
    batches.forEach(batch => {
      const writeBatch = _db.batch();
      batch.forEach(doc => writeBatch.delete(doc.ref));
      commitBatchPromises.push(writeBatch.commit());
    });

    await Promise.all(commitBatchPromises);
  }
}
