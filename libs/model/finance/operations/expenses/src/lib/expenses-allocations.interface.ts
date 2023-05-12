import { Timestamp } from '@firebase/firestore-types';
import { IObject } from '@iote/bricks';

import { ArtifactAllocationStatus } from './expenses-artifact-status.interface';

import { ExpensesAllocationElement } from './expenses-allocation-element.interface';

export interface ExpensesAllocation extends IObject {

  /** Transaction type of allocation-fulfill. */

  /** ID of the alloc exp object (from budget-lines-allocs) . */
  allocId: string;

  elements: ExpensesAllocationElement[];

  allocStatus: ArtifactAllocationStatus;

  /**Account Id is required for updating the unallocated invoice
   * once an allocation has been done.
   */
  to: string;

  /**The amount of money requested on the invoice
   * is necessary for UI display
   */
  amount: number;

  date?: Timestamp | Date;

  /** In case a balance remains/is underpaid. */
  balance?: number;
  /** In case the balance is overpaid */
  credit?: number;

  mode?: 1 | -1;
}