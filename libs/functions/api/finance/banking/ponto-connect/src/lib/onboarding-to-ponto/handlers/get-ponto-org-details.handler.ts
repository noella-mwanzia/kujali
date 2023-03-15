import { HandlerTools } from '@iote/cqrs';
import { FunctionContext, FunctionHandler } from '@ngfi/functions';
import { Query } from '@ngfi/firestore-qbuilder';

import { PontoConnection } from '@app/model/finance/banking/ponto';

import { BankConnectionAccountType } from '@app/model/finance/banking';

import { PontoAccountService } from '../../services/ponto-account.service';


const BANK_ACCOUNT_CONNECTIONS_REPO = (orgId: string) =>  `orgs/${orgId}/bank-connections`;

/**
 * @class GetPontoOrgDetailsHandler
 * @extends {FunctionHandler<{ propId: string }, any>}
 *
 * @param propId: Property id
 * @param transaction: The new payment to be created
 *
 * Step 1. Get Ponto Connection
 * Step 2. Initialize Ponto services
 * Step 3. Fetch and update user access token
 * Step 4. Send payment activation request
 * Step 5. Update paymentsActivated field
 */
export class GetPontoOrgDetailsHandler extends FunctionHandler<{ propId: string, propAccId: string }, any>
{
  public async execute(data: { propId: string, propAccId: string }, context: FunctionContext, tools: HandlerTools): Promise<any> {
    tools.Logger.log(() => `[GetPontoOrgDetailsHandler].execute: Data: ${JSON.stringify(data)}.`);

    // Step 1. Get Ponto Connection
    const _bankConnectionRepo = tools.getRepository<PontoConnection>(BANK_ACCOUNT_CONNECTIONS_REPO(data.propId));
    const query = new Query().where('type', '==', BankConnectionAccountType.Ponto);
    const connections = await _bankConnectionRepo.getDocuments(query);
    const pontoConnection: PontoConnection = connections.length > 0 ? connections[0] : null as any;
    if(!pontoConnection) return;

    // Step 2. Initialize Ponto services
    const _pontoAccService = new PontoAccountService(tools.Logger);

    // Step 3. Fetch and update user access token
    tools.Logger.log(() => `[GetPontoOrgDetailsHandler].execute: Fetching user access.`);
    const userAccess = await _pontoAccService._utilityService.getPontoUserAccess(data.propId, data.propAccId);

    if(!userAccess?.access_token){
      tools.Logger.error(() => `[GetPontoOrgDetailsHandler].execute: Error! User access is invalid: ${ JSON.stringify(userAccess) }.`);
      return;
    }
    tools.Logger.log(() => `[GetPontoOrgDetailsHandler].execute: Fetched user access: ${ JSON.stringify(userAccess) }.`);

    // Step 4. Send payment activation request
    tools.Logger.log(() => `[GetPontoOrgDetailsHandler].execute: Sending payment activation request.`);
    const res = await _pontoAccService.getUserInfo(userAccess.access_token);

    // Step 5. Update paymentsActivated field
    tools.Logger.log(() => `[GetPontoOrgDetailsHandler].execute: Result: ${ JSON.stringify(res) }`);
    tools.Logger.log(() => `[GetPontoOrgDetailsHandler].execute: PaymentsActivated: ${ JSON.stringify(res.paymentsActivated) }`);
    if(res && (pontoConnection.paymentsActivated !== res?.paymentsActivated || !pontoConnection.organizationId)){
      pontoConnection.paymentsActivated = res.paymentsActivated;
      pontoConnection.organizationId = res.sub;
      tools.Logger.log(() => `[GetPontoOrgDetailsHandler].execute: Updating ponto connection: ${ JSON.stringify(pontoConnection) }`);
      delete pontoConnection.userAccess;
      _bankConnectionRepo.update(pontoConnection);
    }

    tools.Logger.log(() => `[GetPontoOrgDetailsHandler].execute: Result: ${ JSON.stringify(res) }`);
    return res ?? null;
  }
}
