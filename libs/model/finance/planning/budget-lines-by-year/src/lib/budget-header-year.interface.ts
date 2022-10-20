
import { AmountPerMonth, BudgetHeader } from "@app/model/finance/planning/budget-lines";

/**
 * Specialisation of @see {BudgetHeader}, with scoping to a single year.
 *
 * Always keeps its reference to the full budget header/row
 */
export interface BudgetHeaderYear extends BudgetHeader
{
  year: number;
  amountsMonth: AmountPerMonth[];
}
