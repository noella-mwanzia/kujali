import { Logger } from '@iote/cqrs';

import * as moment from 'moment';

import { PontoConnectUtilityService } from '../base/ponto-util.service';

import { PontoBankAccount } from '../model/ponto-bank-account.interface';

const PONTO_IBANITY_API_ENDPOINT = 'https://api.ibanity.com/ponto-connect/';

export class PontoAccountService
{
  public _utilityService: PontoConnectUtilityService;

  constructor(private _logger: Logger)
  {
    this._utilityService = new PontoConnectUtilityService(_logger);
  }

  async getUserInfo(token: string)
  {
    const endpoint = PONTO_IBANITY_API_ENDPOINT + 'userinfo/';

    return this._utilityService.performGetRequest(token, endpoint);
  }

  async getAccDetails(token: string, bankAccId: string)
  {
    const endpoint =PONTO_IBANITY_API_ENDPOINT + 'accounts/' + bankAccId;

    const res = await this._utilityService.performGetRequest(token, endpoint);

    return res?.data?.attributes;
  }

  async getAccBalance(token: string, accId: string)
  {
    const account: PontoBankAccount = await this.getAccDetails(token, accId);

    return account.currentBalance;
  }

  async getAccAccessExpiry(token: string, accId: string)
  {
    const account: PontoBankAccount = await this.getAccDetails(token, accId);

    const accessExpiryDate = moment(account.authorizationExpirationExpectedAt);

    return accessExpiryDate;
  }
}