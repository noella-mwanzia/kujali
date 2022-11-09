
import { IObject } from '@iote/bricks';
import { TransactionTypeCategory } from './transaction-type-category.interface';

/**
 * Third-highest level grouping (under a category) of a budget grouping.
 * 
 * - Grouped into transaction lines
 */
export interface TransactionType extends IObject 
{
  /** Group name */ 
  name: string;
  /** Group description */
  description?: string;

  /** Category to which this transaction belongs */
  categoryId: string;
  /** Order. Used to sort the transaction types under a transaction category. */
  order: number;

  /** 
   * @name Type Multiplier. 
   * @description Value is -1 if Cost, 1 if Income.
   *              By having the type multiplier, we can easily aggregate cost and income. */
  type: 1 | -1;
}
