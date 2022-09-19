/**
 * A model-representation of a budget row.
 */
export interface PlannedTransactionStub
{
  id: string;
  name: string;
  createdBy: string;

  startYear: number;
  durationInYears: number;

  /** Depending on category type (= cost | income), baseTypeMultiplier will determine actual value. */
  baseTypeMultiplier: 1 | -1;

  transactionTypeId: string;
  transactionTypeName: string;

  transactionCategoryId: string;
  transactionCategoryName: string;
  transactionCategoryOrder: number;
  transactionCategoryType: string;

  budgetId: string;
}
