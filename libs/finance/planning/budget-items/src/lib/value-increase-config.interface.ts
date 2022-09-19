import { BudgetItemFrequency } from "./types/frequency.interface";

/** 
 * Increase config of a value in the forecast system. 
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
