import { BudgetRow } from "./budget-row.interface";
import { AmountPerMonth } from "./cells/amount-per-month.interface";

/**
 * Budget row scoped to a single year instead of over all years.
 * 
 * @warning - Breaks the Liskov principle as scoping of the amounts is different.
 */
export interface BudgetRowMonths extends BudgetRow
{
  year: number;
  amountsMonth: AmountPerMonth[];
}
