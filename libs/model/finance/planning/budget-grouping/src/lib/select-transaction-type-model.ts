import { TransactionTypeCategory } from "./transaction-type-category.interface";
import { TransactionType } from "./transaction-type.interface";

/**
 * Loaded transaction-type category.
 * 
 * Circular structure which includes all the transaction types belonging to a certain category.
 */
 export interface LoadedTransactionTypeCategory extends TransactionTypeCategory
 {
  types: LoadedTransactionType[];
}

/** 
 * Loaded transaction type. Includes the full category to which this transaction belongs.
 * 
 * Used as template-object for the selection of a category and type on the budget cost planner.
 */
export interface LoadedTransactionType extends TransactionType
{
  /** Category to which this transaction belongs */
  category: TransactionTypeCategory;
}
