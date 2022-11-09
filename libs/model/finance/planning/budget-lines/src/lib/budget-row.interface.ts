import { BudgetRowType } from "@app/model/finance/planning/budget-grouping";
import { AmountPerYear } from "./amount-per-year.interface";

/**
 * A single row in the budget.
 * 
 * Can be copied and specialized to scope over a single year @see BudgetRowYear
 */
export interface BudgetRow
{
  /** Row name */
  name: string;
  /** Row type */
  type: BudgetRowType | string;

  /** Budget amounts by year then by month */
  amountsYear: AmountPerYear[];
  /** Total over the whole period */
  total?: number;

  isGroup?: boolean;
  isRecord?: boolean;
  isHeader?: boolean;
}
