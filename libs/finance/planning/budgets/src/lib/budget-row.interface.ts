import { BudgetRowType } from "./types/budget-row-type.enum";
import { AmountPerYear } from "./cells/amount-per-year.interface";

/**
 * A single row in the budget, casted over a single year.
 */
export interface BudgetRow
{
  name: string;
  type: BudgetRowType | string;

  amountsYear: AmountPerYear[];
  total?: number;

  isGroup?: boolean;
  isRecord?: boolean;
  isHeader?: boolean;
}
