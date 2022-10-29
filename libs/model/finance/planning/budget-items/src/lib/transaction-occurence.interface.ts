
import { IObject } from "@iote/bricks";

import { BudgetItemFrequency } from "./types/frequency.interface";
import { ValueIncreaseConfig } from "./value-increase-config.interface";

/**
 * Transaction plan.
 *  
 * A budget is structured along 
 *  1. budget areas (header, cost, income),
 *  2. then categories (office costs, ...),
 *  3. then lines (office rent, tea, ...)
 * 
 * These lines can be edited by a user by clicking on the line and configuring how the cost of that line should behave.
 * Each change accross the whole budget is what we call a TransactionPlan and is modelled by this interface.
 */
export interface TransactionPlan extends IObject
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

  /**
   * The king occurence is the first transaction occurence that was created for a given line. It births all the other transaction occurences.
   * @note There has to be a king and there can only be one king occurence per budget line.
   * @note The occurence which is the king cannot be deleted, instead it's values are set to 0 for amount and for unit
  */
  king: boolean;
  /** FK to the parent transaction object. */
  lineId: string;
  /** Name of the budget line. */
  lineName: string;
  /** 
   * Depending on category type (= cost [-1] | income [1]), mode will determine actual value. 
   * Mode is determined by the category type (second order grouping i.e. cost vs income)
  */
  mode: 1 | -1;

  /** FK to the transaction type (first order grouping) */
  trTypeId: string;
  /** FK to the transaction type category (second order grouping) */
  trCatId: string;

  /** Increase Settings */
  hasIncrease?: boolean;
  /** Increase config for amount field */
  amntIncrConfig?: ValueIncreaseConfig;
  /** Increase config for unit field. */
  unitIncrConfig?: ValueIncreaseConfig;
}
