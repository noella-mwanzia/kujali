import { Logger } from '@iote/cqrs';

import * as _ from 'lodash';

import { PaymentBase, SANITIZE_TEXT_INPUT } from '@app/model/finance/payments';

import { PontoConnectUtilityService } from '../.../../../base/ponto-util.service';

import { PontoPayment } from '../../model/ponto-payment.interface';

import { PontoTransaction } from '../../model/ponto-transaction.interface';


const PONTO_IBANITY_API_ENDPOINT = 'https://api.ibanity.com/ponto-connect';

export class PontoTransactionsService
{
  public _utilityService: PontoConnectUtilityService;

  constructor(private _logger: Logger)
  {
    this._utilityService = new PontoConnectUtilityService(_logger);
  }

  async fetchTransactions(token: string, accId: string, isInitialFetch: boolean, trId?: string): Promise<PontoTransaction[]>
  {
    const limit = 100; // Maximum number allowed
    let endpoint = PONTO_IBANITY_API_ENDPOINT + `/accounts/${accId}/transactions?page[limit]=${limit}`;

    /*
     * Transactions from Ponto seem to be ordered by date Descending. (Last checked on: 18/10/2021)
     * page[before] query param returns the transactions that came **after** the date of the transactionId provided
    */
    endpoint = trId ? endpoint + `&page[before]=${trId}` : endpoint;

    this._logger.log(() => `[FetchPontoTrsHandler] fetchTransactions(): Beginning fetch from Ponto.`);

    return await this._makeRecursiveCallToPonto(token, [], endpoint, isInitialFetch, limit);
  }

  private async _makeRecursiveCallToPonto(token: string, transactions: any[] = [], endpoint: string, isInitialFetch: boolean, limit: number, index = 1): Promise<PontoTransaction[]>
  {
    const result = await this._utilityService.performGetRequest(token, endpoint);

    // Add to transactions list
    transactions.push(result.data);

    const newEndpoint = this._determineNextLink(isInitialFetch, result);

    // Fetch next batch
    if(newEndpoint)
    {
      this._logger.log(() => `[FetchPontoTrsHandler] _makeRecursiveCallToPonto(): Making call to fetch ${limit} more transactions`);

      return this._makeRecursiveCallToPonto(token, transactions, newEndpoint, isInitialFetch, index++, limit);
    }
    else
    {
      return _.flatten(transactions);
    }
  }

  /**
   * @param {FinancialYear} activeFYear is always null except for during initial fetch from Ponto/if no transaction was retrieved during the previous fetch
   * @param {*} result payload received from ponto
   * @return {*} null or next endpoint string
   * @memberof PontoTransactionsService
   */
  private _determineNextLink(isInitialFetch: boolean, result: any)
  {
    // If it is the initial fetch, make recursive call to fetch all trs from Ponto.
    if(isInitialFetch && result.data.length)
    {
      return result.links.next;
    }
    else{
      return result.links.prev;
    }
  }

  /**
   * Each customer(i.e org in this case) needs to activate payments in order to enable PaymentBase initiation
   * @see https://documentation.ibanity.com/ponto-connect/1/api/curl#payment-activation-request
   * */
  async activatePayments(token: any, redirectUrl: string)
  {
    const endpoint = PONTO_IBANITY_API_ENDPOINT + '/payment-activation-requests';

    const data = {
      type: "paymentActivationRequest",
      attributes: {
        redirectUri: redirectUrl
      }
    }
    return this._utilityService.doCall(data, endpoint, token);
  }

  /**
   * @see https://documentation.ibanity.com/ponto-connect/1/api/curl#create-payment
   * @param token Access token
   * @param accId bankAccId of Ponto account
   * @param transaction the PaymentBase to be initiated
   * @param redirectUrl Url Ponto will redirect to after consent flow
   * @returns
   */
  async initiateCreditTransfer(token: any, accId: string, transaction: PaymentBase, redirectUrl: string)

  {
    const endpoint = PONTO_IBANITY_API_ENDPOINT + '/accounts/' + accId + '/payments';

    const data: PontoPayment = {
      type: "payment",
      attributes: {
        remittanceInformation: transaction.id ?? '',
        remittanceInformationType: 'structured',
        currency: "EUR",
        amount: transaction.amount,
        creditorName: SANITIZE_TEXT_INPUT(transaction.toAccName)!,
        creditorAccountReference: transaction.withIban!,
        creditorAccountReferenceType: "IBAN",
        creditorAgentType: "BIC",
        redirectUri: redirectUrl
      }
    }
    return this._utilityService.doCall(data, endpoint, token, true);
  }

}
