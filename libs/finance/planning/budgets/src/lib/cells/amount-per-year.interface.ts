import { AmountPerMonth } from "./amount-per-month.interface";

/**
 * Instance of a planned transaction for a given year. 
 * Contains calculated values of when the transaction will occur for that year.
 * 
 * - This represents a single row in the budget table, scoped to a single year 
 *       (Rows have instances per year, for ease of aggregation)
 */
export interface AmountPerYear
{
  /** Year in which the transacion is planned. */
  year: number;
  /* Transaction amount array for every month. 12 entries. */
  amountsMonth: AmountPerMonth[];
  /** Summed total for that year. Sum of all amounts per month. */
  total: number;
}
