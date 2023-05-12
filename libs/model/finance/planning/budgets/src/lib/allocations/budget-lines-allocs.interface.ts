import { Timestamp } from '@firebase/firestore-types';
import { IObject } from '@iote/bricks';

import { ArtifactAllocationStatus } from './budget-lines-artifact-status.interface';

import { BudgetLinesAllocationElement } from './budget-lines-allocs-element.interface';

export interface BudgetLinesAllocation extends IObject {

  /** Transaction type of allocation-fulfill. */

  /** ID of the alloc exp object (from budget-lines-allocs) . */
  allocId: string;

  elements: BudgetLinesAllocationElement[];

  allocStatus: ArtifactAllocationStatus;

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