import { HandlerTools } from "@iote/cqrs";
import { FunctionContext, FunctionHandler } from "@ngfi/functions";

import * as _ from 'lodash';
import * as moment from 'moment';

import { PontoConnection } from "@app/model/finance/banking/ponto";

import { ACCOUNT_BANK_CONNECTIONS_REPO, ACCOUNT_USER_ACCESS_REPO } from "@app/model/data/repos";


const BANK_ACCOUNT_CONNECTIONS_REPO = (orgId: string) =>  `orgs/${orgId}/bank-connections`;
const USER_ACCOUNT_ACCESS_REPO = (orgId: string) =>  `orgs/${orgId}/bank-connections`;

/**
 * Handler to migrate user access object from previous "buggy"
 * location as a field on a BankConnection object to a separate
 * 'access-info' subcollection.
 *
 * 1. Get corresponding bankConnection object.
 *
 * 2. Create user-access object in user-info subcollection.
 */
export class CorrectUserAccessHandler extends FunctionHandler<{ propId: string; propAccId: string }, void>
{
  public async execute(data: { propId: string, propAccId: string, bankConnectionId?: string }, context: FunctionContext, tools: HandlerTools)
  {
    tools.Logger.log(() => `[CorrectUserAccessHandler].execute: Moving bank connection user access object to a separate subcollection`);

    const _bankConnectionRepo = tools.getRepository<PontoConnection>(ACCOUNT_BANK_CONNECTIONS_REPO(data.propId));
    const connectionId = data.bankConnectionId ?? data.propAccId;
    const bankConnection = await _bankConnectionRepo.getDocumentById(connectionId);

    if(bankConnection){
      tools.Logger.log(() => `[CorrectUserAccessHandler].execute: Found bank connection for account with id ${connectionId}`);
      const _userAccessRepo = tools.getRepository<any>(ACCOUNT_USER_ACCESS_REPO(data.propId, data.propAccId));
      const alreadyMigrated = await _userAccessRepo.getDocumentById('user-access');
      if(!alreadyMigrated){
        const newUserInfo = {} as any;
        newUserInfo.userAccess = bankConnection.userAccess;
        newUserInfo.createdOn = new Date();
        newUserInfo.version = moment().unix();
        newUserInfo.id = `${newUserInfo.version}_${_.random(0, 9999)}`;
        const res = _userAccessRepo.write(newUserInfo, newUserInfo.id);
        tools.Logger.log(() => `[CorrectUserAccessHandler].execute: Successfully migrated user access: ${ bankConnection?.userAccess }, Res: ${ res }.`);
        return res;
      }
      else{
        tools.Logger.log(() => `[CorrectUserAccessHandler].execute: There is already an exiting user-access for connection: ${ connectionId }.`);
      }
    }
    else{
      tools.Logger.log(() => `[CorrectUserAccessHandler].execute: No bank connection found matching id: ${ connectionId }.`);
    }
  }
}
