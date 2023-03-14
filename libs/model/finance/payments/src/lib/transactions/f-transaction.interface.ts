import { IObject } from '@iote/bricks'
import { Timestamp } from '@firebase/firestore-types';

import { FTransactionTypes } from './f-transaction-types.enum';

/** Financial Transaction */
export interface FTransaction extends IObject
{
  /** Transaction Amount */
  amount: number;
  currency?: string;

  date: Timestamp | Date;

  dateReceived?: Timestamp | Date;

  /** From Account - Type FAccount */
  from: string;
  fromAccName: string;

  /** To Account   - Type FAccount */
  to: string;
  toAccName: string;

  notes: string;

  type: FTransactionTypes;

  /** Any additional information to be added.
   *  Particulary useful for special transaction types such as during onboarding. */
  payload?: any;

  for?: string[];
  
  /**
   * Marks the transaction as a fictive accounting help tool.
   *
   * This is used in cases such as in onboarding or certain complex transactions/procedures such as sales of a lot(s).
   * Fictive transactions are hidden in reports and dashboards, and are used to ensure the balance remains correct
   *  by for example countering certain requests.
   */
  fictive?: boolean;

  /** The unique id used to link an incoming payment to an existing provision/invoice.
   * Generated ones use OGM-VCS pattern. i.e: '+++3digits/4digits/5digits+++' = +++(trId)/(lot-number)/(owner-Id)+++
   * @see https://www.europeanpaymentscouncil.eu/sites/default/files/inline-files/Febelfin%20-%20AOS-OGMVCS_1.pdf */
  structuredReference?: string;

  isDraft?: boolean;
}
