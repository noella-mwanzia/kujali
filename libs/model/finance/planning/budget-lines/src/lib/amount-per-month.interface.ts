import { TransactionPlan } from '@app/model/finance/planning/budget-items';

/**
 * Instance of a single month as per the budget.
 * 
 *  - This represents a single row-column pair in the budget table.
 */
export interface AmountPerMonth 
{
  /** Calculated amount for that month */
  amount: number;

  /** Unit amount for that month    - Basis for the column amount */
  baseAmount: number;
  /** Number of units for that month - */
  units: number;

  isOccurenceStart?: boolean;

  /** FK to the budget occurence */
  occurenceId?: string;

  // Reference variable for ease of updating the budget.
  // occurence?: TransactionOccurence;
}

/**
 * Instance of a single month as per the budget produced by calculation.
 * 
 * @note - Only @see {AmountPerMonth} should be stored if persistent storage is desired of this value !
 */
export interface CalculatedAmountPerMonth extends AmountPerMonth
{
  plan?: TransactionPlan;
}