import { Timestamp } from '@firebase/firestore-types';

import { FTransaction } from './transactions/f-transaction.interface';

export enum PaymentSources
{
  Manual = 0,
  Swan = 1,
  Ponto = 2
}

/**
 * A payment. A transaction going from source A to B.
 * 
 * Extended with certain info such as beneficiary etc.
 */
export interface Payment extends PaymentBase
{
  mode: 1 | -1;
  /** Account ID of the account with whom the payment is being done. The with is the opposite of a property account. */
  with: 'self' | 'unknown' | string;
  /** Account name of with */
  withName: string;

  withType: PaymentWithTypes;
 }

/**
 * Base layer for payments. A transaction going from source A to B.
 */
export interface PaymentBase extends FTransaction
{
  verified: boolean;

  /**Checks if payment is a reimbursement, withIban becomes  for account iban */
  isReimbursement?:boolean;
  reImbursementFor?:string;

  withIban?: string;
  verificationDate?: Timestamp;

  /** Optional: List of transaction requests (provisions / payments)
   *              this payment covers. */
  for?: string[];

  /** Fictive payments are system payments initiated as helpers in certain transactions
   *    such a transferring capital between owners. They do not show up in report.s
   */
  fictive?: boolean;

  /**
   * The origin of the payment: i.e Manual / Swan / Ponto
   */
  source?: PaymentSources;

  isOptimistic?: boolean;
}


export enum PaymentWithTypes 
{
  Unknown  = 0,
  Internal = 1,
  Owner    = 2,
  Supplier = 3
}
