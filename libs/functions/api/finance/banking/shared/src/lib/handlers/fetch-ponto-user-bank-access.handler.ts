import { FunctionContext, FunctionHandler } from '@ngfi/functions';

import { HandlerTools } from '@iote/cqrs';

import { BankConnection, BankConnectionAccount, BankConnectionAccountType, FetchAccessTokenCmd } from '@app/model/finance/banking';

// to add swan support in future
// import { SwanFunctionCallsService } from '@s4y/functions/api/banking/swan';

import { PontoConnectUtilityService } from '@app/functions/api/finance/banking/ponto-connect';

import { __FETCH_USER_BANK_ACCESS } from '../services/fetch-user-bank-access.service';

import { _HaltForMiliseconds } from '../providers/halt-for-milliseconds.function';


const BANK_ACCOUNT_CONNECTIONS_REPO = (orgId: string) =>  `properties/${orgId}/bank-connections`;

/**
   * @class FetchBankUserAccessHandler
   *
   * Fetches and returns a new access token to be used when making subsequent calls to Ponto
   *
   */
export class FetchPontoUserBankAccessHandler extends FunctionHandler<FetchAccessTokenCmd, any>
{
  /**
   * Static variable to keep track of the bankConnections that are still actively fetching the
   */
  private static ACTIVE_ACCESS_TOKEN_FETCHES: {[connectionId: string]: boolean} = {};

  public async execute(data: FetchAccessTokenCmd, context: FunctionContext, tools: HandlerTools)
  {
    tools.Logger.log(() => `[FetchBankUserAccessHandler].execute: Processing request for access token for: ${ data.orgId }, AccId ${data.orgAccId}.`);

    // Bank connections have 1-1 mapping with property accounts and they
    // get their id from the account that they correspond to.
    const connectionId = data.orgAccId;

    // Step 1. Check if the fetch is already happening.(1.e blocked)
    let proceedWithExecution = await this._noOngoingRequest(0, 3, connectionId, tools);

    if(!proceedWithExecution){
      tools.Logger.log(() => `[FetchBankUserAccessHandler].execute: Maximum tries exceeded. No userAccess to return`);
      return;
    }

    // Step 2. Lock fetches for this bankConnection.
    FetchPontoUserBankAccessHandler.ACTIVE_ACCESS_TOKEN_FETCHES[connectionId] = true;
    tools.Logger.log(() => `[FetchBankUserAccessHandler].execute: Begining access token fetch validation checks: AccId ${connectionId}.`);

    // Step 3. Initialize Services
    const _utilityService = this._getUtilityService(data.connectionType, context, tools);

    // Step 4. Get Bank Connection object
    const _bankConnectionRepo = tools.getRepository<BankConnection>(BANK_ACCOUNT_CONNECTIONS_REPO(data.orgId));
    const bankConnection = await _bankConnectionRepo.getDocumentById(connectionId);

    if(!bankConnection) {
      tools.Logger.log(() => `[FetchBankUserAccessHandler].execute: No associated connection found for property ${data.orgId}, orgAccId ${connectionId}`);
      FetchPontoUserBankAccessHandler.ACTIVE_ACCESS_TOKEN_FETCHES[connectionId] = false;
      return;
    }
    tools.Logger.log(() => `[FetchBankUserAccessHandler].execute: Found associated bank connection for orgAccId ${connectionId}`);

    // Step 5. Get corresponding property account
    const bankAccount = bankConnection.accounts.find(acc => acc.sysAccId === connectionId);
    this._logCurrentStatus(bankAccount!, data, connectionId, tools);

    // Step 6. Fetch and Update Access token
    const userAccess = await __FETCH_USER_BANK_ACCESS(
                          _utilityService, bankConnection.orgId, bankConnection.id!,
                          tools, data.authCode, data.redirectUrl);

    // Step 7. Remove lock on the bank connection access
    FetchPontoUserBankAccessHandler.ACTIVE_ACCESS_TOKEN_FETCHES[connectionId] = false;

    // Step 8. Return the new token
    return userAccess;

  }

  /**
   * Returns the relevant connection type (currently Ponto/Swan) depending on the bank connection type
   */
  private _getUtilityService(connectionType: BankConnectionAccountType, context: FunctionContext, tools: HandlerTools){
    switch(connectionType){
      case BankConnectionAccountType.Ponto:
        return new PontoConnectUtilityService(tools.Logger);

      // case BankConnectionAccountType.Swan:
      //   return new SwanFunctionCallsService(tools.Logger);
      
      // to remove this default case, we need to add a new connection type for the new bank connection (IAN)
      default: 
        return new PontoConnectUtilityService(tools.Logger);

    }
  }

  /**
   * Function lock/queuing execution :-
   * 1. Check if there are any ongoing fetches.
   * 2. Wait incremental periods [500, 1000, 1500] and check again if the ongoing fetches have completed.
   * 3. If maximum number of tries have been exceeded, return.
   *
   * @param numOfTries Number of times the function has been called
   * @param maxTries Maximum number of times the function should be called
   * @param connectionId Bank Connection id
   * @param tools Handler Tools
   * @param maxTriesExceeded Used in recursive call to check whether numOfTries > max_tries
   * @returns boolean indicating whether it is safe to proceed with User Access fetch
   */
  private async _noOngoingRequest(numOfTries: number = 0, maxTries: number = 3, connectionId: string, tools: HandlerTools, maxTriesExceeded = false){
    const hasOngoingFetch = FetchPontoUserBankAccessHandler.ACTIVE_ACCESS_TOKEN_FETCHES[connectionId]
    let proceedWithExecution = !hasOngoingFetch;
    const waitTimes = [500, 1000, 1500];
    const waitTime = numOfTries <= waitTimes.length ? waitTimes[numOfTries] : waitTimes[2];

    if(maxTriesExceeded || proceedWithExecution){
      tools.Logger.log(() => `[FetchBankUserAccessHandler].execute: No access token fetch in progress. Proceeding with execution. AccId ${connectionId}.`);
      return proceedWithExecution;
    } else {
      tools.Logger.log(() => `[FetchBankUserAccessHandler].execute: A previous access token fetch is already in progress. Retrying in 300ms. AccId ${connectionId}.`);
      await _HaltForMiliseconds(waitTime);
      tools.Logger.log(() => `[FetchBankUserAccessHandler].execute: Retrying check.`);
      numOfTries++;
      maxTriesExceeded = numOfTries > (maxTries - 1);
      return this._noOngoingRequest(numOfTries, maxTries, connectionId, tools, maxTriesExceeded);
    }
  }

  private _logCurrentStatus(bankAccount: BankConnectionAccount, data: FetchAccessTokenCmd, connectionId: string, tools: HandlerTools){
    if(bankAccount){
      tools.Logger.log(() => `[FetchBankUserAccessHandler].execute: Found associated account on orgAccId ${connectionId}, bankAccId ${bankAccount?.bankAccId}`);
    } else if(data.authCode){
      tools.Logger.log(() => `[FetchBankUserAccessHandler].execute: No associated account on orgAccId ${connectionId} was found, but authCode ${ data.authCode } was provided`);
    } else {
      tools.Logger.log(() => `[FetchBankUserAccessHandler].execute: No associated account found for property ${data.orgId}, orgAccId ${connectionId}`);
      FetchPontoUserBankAccessHandler.ACTIVE_ACCESS_TOKEN_FETCHES[connectionId] = false;
      return;
    }
  }
}