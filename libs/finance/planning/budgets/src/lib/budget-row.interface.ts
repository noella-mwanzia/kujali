import { BudgetRowType } from "./budget-row-type.type";
import { AmountPerYear } from "./cells/amount-per-year.interface";

/**
 * A single row in the budget. 
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
