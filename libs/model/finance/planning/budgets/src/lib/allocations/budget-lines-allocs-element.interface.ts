import { Timestamp } from '@firebase/firestore-types';
import { IObject } from '@iote/bricks';

import { AllocateWithType } from '@app/model/finance/allocations';

/**
 * A single element of allocation information concerning an invoice.
 *
 *  - The allocation element "explains" how the invoice has been paid.
 *    This explanation comes in the form of a linked payment, or in some cases a linked invoice of opposite mode.
 *
 *  - The allocation element can be one of many for the same invoice, as the invoice can be paid in bits.
 */
export interface BudgetLinesAllocationElement extends IObject
{

  expenseId: string;

  /** Transaction type of allocation-fulfill. */
  allocType?: AllocateWithType;

  /** Amount allocated to the invoice. */
  allocAmount: number;

  allocMode: 1 | -1;
}
