import { HandlerTools } from '@iote/cqrs';
import { Query } from '@ngfi/firestore-qbuilder';

import * as _ from 'lodash';
import * as moment from 'moment';

import { AccessTokenWrapper, BankConnection, BankConnectionStatus, RefreshTokenStatus } from '@app/model/finance/banking';

// import { SwanFunctionCallsService } from '@app/functions/api/banking/swan';
import { PontoConnectUtilityService } from '@app/functions/api/finance/banking/ponto-connect';

import { AccessStatus, AccessStatusOption, PontoUserAccessError } from '../model/ponto-user-access-status.interface';

const USER_ACCOUNT_STATUS_REPO = () => `bank-disconnections`;
const BANK_ACCOUNT_CONNECTIONS_REPO = (orgId: string) => `orgs/${orgId}/bank-connections`;
const USER_ACCOUNT_ACCESS_REPO = (orgId: string, connectionId: string) => `orgs/${orgId}/bank-connections/${connectionId}/access-info`;

 /**
 * Fetches the access_token from the respective Banking API and updates the Database
 *
 * Step 0. Fetch the latest Bank connection access token
 * Step 1. Check if fetched refresh token is still valid
 * Step 2. Make call to banking API to fetch a new token
 * Step 3. Add the new access token to db
 * Step 4. Update previous token status to invalidate it and prevent attempting to use the same refresh token twice
 *
 * @param _utilityService Bank Service that communicates with/utilizes the respective Banking API
 * @param orgId The Organisation id
 * @param connectionId bank conneciton is (Same id as the wac_ or sac_ id that it connects to the bank)
 * @param tools HandlerTools
 * @param authCode (optional) authCode returned in the url - only retrieved during onboarding
 * @param redirectUrl (optional) the url that was sent back with the authCode - Security measure on the API side
 * @returns
 */
export async function __FETCH_USER_BANK_ACCESS(
  _utilityService: PontoConnectUtilityService ,
  orgId: string,
  connectionId: string,
  tools: HandlerTools,
  authCode?: string,
  redirectUrl?: string
){
  tools.Logger.log(() => `[__FETCH_BANK_USER_ACCESS]: Fetching Bank connection user info.`);

  tools.Logger.log(() => `[__FETCH_BANK_USER_ACCESS]: Step 1. Fetch the latest Bank connection user access token.`);
  const _accessTokensRepo = tools.getRepository<AccessTokenWrapper>(USER_ACCOUNT_ACCESS_REPO(orgId, connectionId));
  const query = new Query().orderBy('createdOn', 'desc').limit(1);
  const previousTokenWrappers = await _accessTokensRepo.getDocuments(query);
  const previousTokenWrapper = previousTokenWrappers?.length > 0 ? previousTokenWrappers[0] : null;
  tools.Logger.log(() => `[__FETCH_BANK_USER_ACCESS]: Latest Bank connection user access token: ${JSON.stringify(previousTokenWrapper)}.`);

  if(!previousTokenWrapper?.status) {
    try{
      tools.Logger.log(() => `[__FETCH_BANK_USER_ACCESS]: Step 2. Make call to banking API to fetch a new access token.`);

      const newAccessToken = await _utilityService.getAccessToken(previousTokenWrapper?.userAccess?.refresh_token!, authCode ?? '', redirectUrl ?? '');

      if(newAccessToken?.access_token){
        tools.Logger.log(() => `[__FETCH_BANK_USER_ACCESS SUCCESSFUL!! 🎉]: Step 3. Add the new access token to db: ${ JSON.stringify(newAccessToken)}`);
        const newTokenWrapper = {} as any;
        newTokenWrapper.userAccess = newAccessToken;
        newTokenWrapper.createdOn = new Date();
        newTokenWrapper.version = moment().unix();
        newTokenWrapper.id = `${newTokenWrapper.version}_${_.random(0, 9999)}`;
        newTokenWrapper.status = RefreshTokenStatus.VALID;

        await _accessTokensRepo.create(newTokenWrapper, newTokenWrapper.id);
        tools.Logger.log(() => `[__FETCH_BANK_USER_ACCESS]: 🎉. New token SUCCESSFULfully added to db.`);
        return newAccessToken;
      }
    } catch (err) {
      LOG_ACCESS_STATUS(orgId, connectionId, tools, AccessStatusOption.ERROR, err as PontoUserAccessError);
      tools.Logger.log(() => `[__FETCH_BANK_USER_ACCESS]: ❌ Error fetching user access object. Request might have been initiated from the wrong url.`);
      tools.Logger.log(() => `[__FETCH_BANK_USER_ACCESS]: ❌ Error: ${JSON.stringify(err)}`);
    } finally {
      if(previousTokenWrapper) {
        // NOTE: In production, requesting an access_token using the same refresh_token
        // more than once causes the authorization to be revoked.
        tools.Logger.log(() => `[__FETCH_BANK_USER_ACCESS]: Step 4. Invalidate previous refresh token: ${ JSON.stringify(previousTokenWrapper)}`);
        previousTokenWrapper.status = RefreshTokenStatus.USED;
        await _accessTokensRepo.update(previousTokenWrapper);
      }
    }
  } else {
    tools.Logger.log(() => `[__FETCH_BANK_USER_ACCESS]: ❌ Previous refresh token is invalid: ${ JSON.stringify(previousTokenWrapper)}. Exiting function execution.`);
  }

}

/**
 * Logs any Access Token errors thrown by Ponto
 * and sets bankConnection access status to REVOKED
 * so that clients can re-authorize their account
 * @param orgId
 * @param connectionId
 * @param tools
 * @param status
 */
export async function LOG_ACCESS_STATUS(
  orgId: string,
  connectionId: string,
  tools: HandlerTools,
  status: AccessStatusOption,
  error: PontoUserAccessError
) {
  tools.Logger.log(() => `[LOG_ACCESS_STATUS]: Step 1. Saving Access status to db, new status: ${status}.`);
  const _accessErrorLogsRepo = tools.getRepository<AccessStatus>(USER_ACCOUNT_STATUS_REPO());

  const newAccessLog: AccessStatus = {
    createdOn: new Date(),
    status,
    orgId,
    connectionId,
    accountId: connectionId,
    error : {
      name: error.error?.error ?? 'User Access Error',
      statusCode: error?.statusCode ?? 400,
      description: error.error?.error_description ?? error.message ?? ''
    }
  }

  await _accessErrorLogsRepo.create(newAccessLog);

  // Step 4. Get Bank Connection object
  const _bankConnectionRepo = tools.getRepository<BankConnection>(BANK_ACCOUNT_CONNECTIONS_REPO(orgId));
  const bankConnection = await _bankConnectionRepo.getDocumentById(connectionId);

  bankConnection.status = BankConnectionStatus.REVOKED;

  await _bankConnectionRepo.update(bankConnection);
}