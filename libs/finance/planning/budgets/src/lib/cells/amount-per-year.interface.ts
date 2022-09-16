import { AmountPerMonth } from "./amount-per-month.interface";

/**
 * Instance of a planned transaction for a given year. 
 * Contains calculated values of when the transaction will occur for that year.
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
