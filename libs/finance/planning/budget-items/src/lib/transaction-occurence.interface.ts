
import { IObject } from "@iote/bricks";

import { BudgetItemFrequency } from "./types/frequency.interface";
import { ValueIncreaseConfig } from "./value-increase-config.interface";

/**
 * Transaction occurence.
 * 
 * Needs to be used as part of a list. Later transactions override earlier ones.
 */
export interface TransactionOccurence extends IObject
{
  /** Amount for this occurence. */
  amount: number;
  /** Times this occurence transacts (per occurance). */
  units: number;

  /** From when this occurence occures - Year */
  fromYear: number;
  /** From when this occurence occures - Month */
  fromMonth: number;

  /** Occurence frequency type. */
  frequency: BudgetItemFrequency;
  /** If frequency is a timed interval i.e. every 6 months, every 2 years, .. */
  xTimesInterval: number;

  /** Financial Plan Id.
   *  Child plans can override transaction occurences and will always have first priority. */
  budgetId: string;

  /** Id to the parent transaction object. */
  transactionId: string;
  transactionName: string;
  /** Depending on category type (= cost | income), baseTypeMultiplier will determine actual value. */
  baseTypeMultiplier: 1 | -1;

  transactionTypeId: string;
  transactionTypeName: string;

  transactionCategoryId: string;
  transactionCategoryName: string;
  transactionCategoryOrder: number;
  transactionCategoryType: string;

  /** Increase Settings */
  hasIncrease?: boolean;
  increaseConfig: ValueIncreaseConfig;
}
