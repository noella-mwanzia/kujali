import { TransactionType } from "@app/model/finance/planning/budget-grouping";
import { BudgetItemFrequency } from "@app/model/finance/planning/budget-items";

export interface CreateTransactionForm
{
  createdBy: string;

  // Section 1: Transaction
  type: TransactionType;
  name: string;

  budgetId: string;

  // Section 2: Occurance Config
  /** Amount for this occurence. */
  amount: number;
  /** Times this occurence transacts (per occurance). */
  units: number;

  /** From when this occurence occures - Year */
  yearFrom: number;
  /** From when this occurence occures - Month */
  monthFrom: { name: 'string', month: number, slug: 'string' },

  /** Occurence frequency type. */
  frequency: BudgetItemFrequency;
  /** If frequency is a timed interval i.e. every 6 months, every 2 years, .. */
  xTimesInterval: number;

  /** Id to the parent transaction object. */
  transactionId: string;

  /** Depending on category type (= cost | income), baseTypeMultiplier will determine actual value. */
  baseTypeMultiplier: 1 | -1;

  // transactionName: string;

  // transactionTypeId: string;
  // transactionTypeName: string;

  // transactionCategoryId: string;
  // transactionCategoryName: string;

  /** Increase Settings */
  hasIncrease?: boolean;
  amountIncreaseConfig: false | 'value' | 'percentage';
  amountIncreaseFrequency: BudgetItemFrequency;
  /* Amount Increase Rate -> if amountIncrease = fixed, full number, if = percentage, percentual increase */
  amountIncreaseRate: number;
  /** If frequency is 'every-x-times', how many times? */
  xTimesAmountIncreaseInterval?: number;

  unitIncreaseConfig: false | 'value' | 'percentage';
  unitIncreaseFrequency: BudgetItemFrequency;
  /* Unit Increase Rate -> if amountIncrease = fixed, full number, if = percentage, percentual increase */
  unitIncreaseRate: number;
  /** If frequency is 'every-x-times', how many times? */
  xTimesUnitIncreaseInterval?: number;

}
