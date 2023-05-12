import { PaymentBase, PaymentSources } from './payment.interface';
import { FTransaction } from '@app/model/finance/payments';

export interface BankTransaction extends FTransaction, PaymentBase {
  ibanTo: string;
  ibanFrom: string;

  trStatus: 'Approved' | 'Pending' | string;

  description: string;

  mode: -1 | 1,

  /**
   * The origin of the payment: i.e Manual / Swan / Ponto
   */
   source?: PaymentSources;

   cursor?: string;

   originalTransaction: any;

   bankPmtId?: string;
}
