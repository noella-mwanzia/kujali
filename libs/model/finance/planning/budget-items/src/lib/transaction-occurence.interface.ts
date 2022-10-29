
import { IObject } from "@iote/bricks";

import { BudgetItemFrequency } from "./types/frequency.interface";
import { ValueIncreaseConfig } from "./value-increase-config.interface";

/**
 * Transaction occurence.
 *  
 * A budget is structured along 
 *  1. budget areas (header, cost, income),
 *  2. then categories (office costs, ...),
 *  3. then lines (office rent, tea, ...)
 * 
 * These lines can be edited by a user by clicking on the line and configuring how the cost of that line should behave.
 * This configuration we call a TransactionOccurence and is modelled by this interface.
 */
export interface TransactionOccurence extends IObject
{
  /** Organisation ID */
  orgId: string;
  /** Financial Plan Id.
   *  Child plans can override transaction occurences and will always have first priority. */
  budgetId: string;

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

  /** FK to the parent transaction object. */
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
