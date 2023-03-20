import { Timestamp } from '@firebase/firestore-types';
import { IObject } from '@iote/bricks';
import { BankConnectionAccountType } from "./bank-connection-account-type.enum";

/**
 * A single connection between an kujali FAccount and a third party integrator bank account
 */
export interface BankConnectionAccount extends IObject
{
  name: string;
  /** Type of integration. Currently we support swan (we are the bank) and ponto (we use a bank) as integrators */
  type: BankConnectionAccountType;
  /** The international bank code of the account */
  bic: string;
  /** The iban of the account */
  iban: string;
  /** The status of the account */
  status: BankAccountStatus;
  /** FAccount id */
	sysAccId: string;
  /** FAccount name */
	sysAccName?: string;
	/** Identifier of this account at the third party */
	bankAccId: string;
  /** Whether bank Account is in use */
  active: boolean;
  /** When the bank account was created **/
  activationDate: Timestamp;
  /** The original account object before mapping to Kujali account  */
  originalAccountInstance: any;

  /** Account balances as per the bank */
  balances?: {
    available?: {
      currency: string;
      value: string;
    }
    booked?: {
      currency: string;
      value: string;
    }
    pending?: {
      currency: string;
      value: string;
    }
  }
}

export enum BankAccountStatus{
  'Opened',
  'Suspended',
  'Closed',
  'Closing'
}
