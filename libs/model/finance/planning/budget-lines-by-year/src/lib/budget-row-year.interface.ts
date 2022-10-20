
import { AmountPerMonth, BudgetRow } from "@app/model/finance/planning/budget-lines";

/**
 * Specialisation of @see {BudgetRow}, with scoping to a single year.
 *
 * Always keeps its reference to the full budget row
 */
export interface BudgetRowYear extends BudgetRow
{
  year: number;
  amountsMonth: AmountPerMonth[];
}
