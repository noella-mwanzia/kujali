import { FunctionHandler, FunctionContext } from '@ngfi/functions';
import { Query } from '@ngfi/firestore-qbuilder';
import { HandlerTools } from '@iote/cqrs';

import { BankConnectionAccountType } from '@app/model/finance/banking';
import { PontoConnection } from '@app/model/finance/banking/ponto';

import { PontoConnectUtilityService } from '../../base/ponto-util.service';

import { PontoReauthRequest } from '../../model/ponto-reauth-request.interface';

import { PontoConnectOnboardingService } from '../services/ponto-connect-onboarding.service';


const BANK_ACCOUNT_CONNECTIONS_REPO = (orgId: string) =>  `orgs/${orgId}/bank-connections`;

/**
   * @class ReauthorizePontoAccountHandler
   *
   * Step 1. Initialize Services
   *
   * Step 2. Get Bank Connection object
   *
   * Step 3. Update Access token
   *
   * Step 4. Create ReAuthorization Request
   *
   * @returns onboardingObject id or errors object
   */
export class ReauthorizePontoAccountHandler extends FunctionHandler<{ orgId: string, orgAccId: string, redirectUrl: string }, any>
{
  public async execute(data: { orgId: string, orgAccId: string, redirectUrl: string }, context: FunctionContext, tools: HandlerTools)
  {
    tools.Logger.log(() => `[ReauthorizePontoAccountHandler].execute: Processing request for re-authorization for: ${ data.orgId }, AccId ${data.orgAccId}.`);

    // Step 1. Initialize Services
    const pontoUtilityService = new PontoConnectUtilityService(tools.Logger);
    const onboardingService = new PontoConnectOnboardingService(tools.Logger);

    // Step 2. Get Bank Connection object
    const _bankConnectionRepo = tools.getRepository<PontoConnection>(BANK_ACCOUNT_CONNECTIONS_REPO(data.orgId));
    const query = new Query().where('type', '==', BankConnectionAccountType.Ponto);
    const connections = await _bankConnectionRepo.getDocuments(query);
    const pontoConnection: PontoConnection = connections.length > 0 ? connections[0] : null as any;

    if(!pontoConnection) return;

    const pontoAccount = pontoConnection.accounts.find(acc => acc.sysAccId === data.orgAccId);

    if(!pontoAccount) {
      tools.Logger.log(() => `[ReauthorizePontoAccountHandler].execute: No associated account found for property ${data.orgId}, orgAccId ${data.orgAccId}`);
      return;
    }

    // Step 3. Update Access token
    tools.Logger.log(() => `[ReauthorizePontoAccountHandler].execute: Fetching user access.`);
    const userAccess = await pontoUtilityService.getPontoUserAccess(data.orgId, data.orgAccId);

    if(!userAccess?.access_token){
      tools.Logger.error(() => `[ReauthorizePontoAccountHandler].execute: Error! User access is invalid: ${ JSON.stringify(userAccess) }.`);
      return;
    }
    tools.Logger.log(() => `[ReauthorizePontoAccountHandler].execute: Fetched user access: ${ JSON.stringify(userAccess) }.`);

    // Step 4. Create ReAuthorization Request
    const result = await onboardingService.requestReauthorization(pontoAccount.bankAccId, data.redirectUrl, userAccess);

    if(result.errors)
    {
      tools.Logger.error(() => "[ReauthorizePontoAccountHandler].execute:An error has occured.");
      tools.Logger.log(() => JSON.stringify(result));
      return result;
    }

    tools.Logger.log(() => `[ReauthorizePontoAccountHandler].execute: SUCCESS!! 🙌🙌🎉🎉🎉🎉🎉. Redirect request object: ${JSON.stringify(result.data)}`);

    // Step 3. Return reAuthorize url
    return (result.data as PontoReauthRequest)?.links?.redirect;
  }

}