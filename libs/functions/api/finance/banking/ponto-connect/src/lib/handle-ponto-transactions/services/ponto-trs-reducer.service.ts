/* eslint-disable @typescript-eslint/no-empty-function */
import { __DateToStorage } from '@iote/time';

import * as moment from 'moment-timezone';

import { PaymentSources } from '@app/model/finance/payments';
import { BankTransaction } from '@app/model/finance/payments';
import { FTransactionTypes } from '@app/model/finance/payments';

import { PontoTransaction } from '../../model/ponto-transaction.interface';

export class PontoTrReducerService
{
  constructor() { }

  convertToKujaliPayment(pontoTransactions: PontoTransaction[], accName: string, accId: string, iban: string)
  {
    return pontoTransactions.map(tr => this.convertToPayment(tr, accName, accId, iban));
  }

  convertToPayment(transaction: PontoTransaction, accName: string, accId: string, iban: string): BankTransaction
  {
    const tr: BankTransaction = {
      id: transaction.id,
      amount:  Math.abs(transaction.attributes.amount),
      type: FTransactionTypes.PaymentBase,
      date: __DateToStorage(moment(transaction.attributes.valueDate).tz("Europe/Brussels")),
      notes: transaction.attributes.remittanceInformation ?? transaction.attributes.description,
      verified: transaction.attributes.valueDate ? true: false,
      verificationDate:  __DateToStorage(moment(transaction.attributes.valueDate)),

      from:        transaction.attributes.amount > 0 ? '' : accId,
      fromAccName: transaction.attributes.amount > 0 ? transaction.attributes.counterpartName : accName,
      to:          transaction.attributes.amount <= 0 ? '' : accId,
      toAccName:   transaction.attributes.amount <= 0 ? transaction.attributes.counterpartName : accName,

      for: [transaction.attributes.remittanceInformation],
      description: transaction.attributes.description,

      ibanTo: transaction.attributes.amount <= 0 ? transaction.attributes.counterpartReference : iban,
      ibanFrom: transaction.attributes.amount > 0 ? transaction.attributes.counterpartReference : iban,
      trStatus: transaction.attributes.valueDate ? 'Approved' : 'Pending',

      mode: transaction.attributes.amount <= 0 ? -1 : 1,

      createdOn: moment(transaction.attributes.executionDate).toDate(),

      source: PaymentSources.Ponto,

      originalTransaction: transaction.attributes
    };

    return tr;
  }

  convertToPontoPayment(transaction: BankTransaction, redirectUrl: string)
  {
    return {
      type: "payment",
      attributes: {
        remittanceInformation: transaction.id ?? '',
        remittanceInformationType: 'structured',
        requestedExecutionDate: moment(transaction.date).format('YYYY-MM-DD'),
        currency: "EUR",
        amount: transaction.amount,
        creditorName: transaction.toAccName,
        creditorAccountReference: transaction.withIban,
        creditorAccountReferenceType: "IBAN",
        creditorAgentType: "BIC",
        redirectUri: redirectUrl
      }
    }
  }

}
