import { BudgetItemFrequency } from "./types/frequency.interface";

/** 
 * A user can configure how a transaction should be increased over time.
 * 
 * This configuration is described by the ValueIncreaseConfig element.
 */
export interface ValueIncreaseConfig 
{
  incrStyle: false | 'value' | 'percentage';
  incrFreq: BudgetItemFrequency;
  /* Amount Increase Rate -> if amountIncrease = fixed, full number, if = percentage, percentual increase.
     Unit Increase Rate -> if amountIncrease = fixed, full number, if = percentage, percentual increase. */
  incrRate: number;
  /** If frequency is 'every-x-times', how many times? */
  interval?: number;
}
