import { __DateToStorage } from '@iote/time';
import { HandlerTools, Repository } from '@iote/cqrs';

import { Query } from "@ngfi/firestore-qbuilder";
import { FunctionHandler, FunctionContext } from '@ngfi/functions';

import * as moment from 'moment';

import { BankAccountStatus, BankConnectionAccountType, BankConnectionStatus } from '@app/model/finance/banking';
import { PontoAccount, PontoConnection, UpdatePontoConnInput } from '@app/model/finance/banking/ponto';

import { PontoConnectUtilityService } from './../../base/ponto-util.service';
import { PontoConnectOnboardingService } from '../services/ponto-connect-onboarding.service';

const BANK_ACCOUNT_CONNECTIONS_REPO = (orgId: string) =>  `orgs/${orgId}/bank-connections`;

const PONTO_IBANITY_API_ENDPOINT = process.env['PONTO_IBANITY_API_ENDPOINT'];

/**
 * @class UpdatePontoConnectionHandler
 *
 * @description Creates a new ponto connection object and links the newly created ponto account to the org's FAccount
 *
 * // Step 1. Fetch Ponto or Create Bank connection for this org
 *
 * // Step 2. Update the bank connection with latest access token to facillitate next use.
 *
 * // Step 3. Fetch all authorized Ponto Accounts
 *
 * // Step 4. Transform into Kujali - relevant accounts and return transformed accounts list
 *
 * @returns PontoConnection
 *
 */
export class UpdatePontoConnectionHandler extends FunctionHandler<UpdatePontoConnInput, PontoAccount[]>
{

  public async execute(data: UpdatePontoConnInput, context: FunctionContext, tools: HandlerTools)
  {
    tools.Logger.log(() => `[UpdatePontoConnectionHandler].execute: Setting ponto details for account: ${ data.accountId } on org ${ data.orgId }`);

    // Step 1. Create Bank connection for this org and Delete any previous connections
    const _bankConnectionRepo = tools.getRepository<PontoConnection>(BANK_ACCOUNT_CONNECTIONS_REPO(data.orgId));
    const pontoConnection = await this._getPontoBankConn(data, _bankConnectionRepo, tools);

    // Step 2. Fetch and update Access token for this bank connection;
    // < Update the bank connection with latest access token (will be used to get refresh token during next use). >
    const _utilityService = new PontoConnectUtilityService(tools.Logger);
    tools.Logger.log(() => `[UpdatePontoConnectionHandler].execute: Fetching user access.`);
    const userAccess = await _utilityService.getPontoUserAccess(data.orgId, data.accountId, data.authCode, data.redirectUrl);

    if(!userAccess?.access_token){
      tools.Logger.error(() => `[UpdatePontoConnectionHandler].execute: Error! User access is invalid: ${ JSON.stringify(userAccess) }.`);
      return;
    }
    tools.Logger.log(() => `[UpdatePontoConnectionHandler].execute: Fetched user access: ${ JSON.stringify(userAccess) }.`);

    // Step 3. Fetch all authorized Ponto Accounts
    const onboardingService = new PontoConnectOnboardingService(tools.Logger);
    const accObjects: any[] = await onboardingService.getPontoFAccounts(userAccess.access_token);
    tools.Logger.log(() => `[UpdatePontoConnectionHandler].execute: Fetched Ponto accounts: ${ accObjects?.length }`);

    // Step 4. Transform into Kujali - relevant accounts
    const pontoAccounts = await this._toFAccounts(accObjects, data, tools);

    return pontoAccounts as any;
  }

  private async _getPontoBankConn(data: UpdatePontoConnInput, _bankConnectionRepo: Repository<PontoConnection>, tools: HandlerTools)
  {
    const query = new Query().where('type', '==', BankConnectionAccountType.Ponto);
    const connections = await _bankConnectionRepo.getDocuments(query);
    let pontoConnection: PontoConnection = connections.length > 0 ? connections[0] : null as any;
    let existingToken;

    // TODO: IAN review use case for this
    // If there's an existing Ponto Connection, delete it
    // if(pontoConnection){
    //   existingToken = pontoConnection.userAccess;
    //   await _bankConnectionRepo.delete(pontoConnection.id!)
    // }

    // Create a new ponto conn
    pontoConnection = this._createPontoConn(data.orgId, data.accountName, data.accountId);
    await _bankConnectionRepo.create(pontoConnection, data.accountId);

    // Append any pre-existing token
    if(existingToken){
      pontoConnection.userAccess = existingToken;
    }

    tools.Logger.log(() => `[UpdatePontoConnectionHandler].execute: Ponto connection (new): ${ JSON.stringify(pontoConnection) }`);

    return pontoConnection;
  }

  private _createPontoConn(orgId: string, accName: string, accId: string): PontoConnection
  {
    return {
      id: accId,
      name: accName,
      orgId: orgId,
      organizationId: orgId,
      accounts: [],
      type: BankConnectionAccountType.Ponto,
      status: BankConnectionStatus.ENABLED,
      userAccess: {} as any,
      paymentsActivated: PONTO_IBANITY_API_ENDPOINT!.includes('sandbox'),
      paymentActivationUrl: '',
    } as PontoConnection;
  }

  private async _toFAccounts(accounts: any[], data: any, tools: HandlerTools): Promise<PontoAccount[]>
  {
    if(!accounts) return [];

    // Convert to Relevant Account type
    return accounts.map(accObj => this.convertToAcc(accObj, data.accountId, data.accountName));
  }

  convertToAcc(pontoAccObject: any, sysAccId: string, sysAccName: string): PontoAccount
  {
    if(!pontoAccObject) return false as any;

    return {
      name: pontoAccObject.attributes.product + pontoAccObject.attributes.description,
      type: BankConnectionAccountType.Ponto,
      bic: '',
      iban: pontoAccObject.attributes.reference,
      status: BankAccountStatus.Opened,
      sysAccId: sysAccId,
      sysAccName: sysAccName,
      bankAccId: pontoAccObject.id,
      active: true,
      activationDate: __DateToStorage(moment()),
      originalAccountInstance: pontoAccObject
    };
  }
}