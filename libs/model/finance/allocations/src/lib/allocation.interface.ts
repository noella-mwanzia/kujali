import { IObject } from '@iote/bricks';

/** Allocation model.
 *  Acts as the link between an invoice and a payment */
export interface Allocation extends IObject
{
  pId: string;

  /** Id of the invoice being reconciled. */
  invId: string

  trType: AllocateWithType;

  amount?: number;
}

/**
 * Type with which we are allocating.
 *
 * - Can be either a payment or an invoice of the opposite mode.
 */
export enum AllocateWithType
{
  /** a payment/cash transaction. */
  Payment = 'payment',

  /** Invoice allocation */
  Invoice = 'invoice',

  /** Expense allocation */
  Expense = 'expense',

  /** Credit that is the result of a past allocation. */
  AllocCredit = 'credit',

  BudgetLine = 'budgetLine'
}
