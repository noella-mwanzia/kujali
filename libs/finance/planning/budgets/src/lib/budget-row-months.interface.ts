import { BudgetRow } from "./budget-row.interface";
import { AmountPerMonth } from "./cells/amount-per-month.interface";

export interface BudgetRowMonths extends BudgetRow
{
  year: number;
  amountsMonth: AmountPerMonth[];
}
