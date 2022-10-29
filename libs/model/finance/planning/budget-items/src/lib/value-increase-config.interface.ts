import { BudgetItemFrequency } from "./types/frequency.interface";

/** 
 * A user can configure how a transaction should be increased over time.
 * 
 * This configuration is described by the ValueIncreaseConfig element.
 */
export interface ValueIncreaseConfig 
{
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
