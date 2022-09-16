import { BudgetRow } from "../budget-row.interface";
import { AmountPerYear } from "./amount-per-year.interface";

export interface BudgetRowYears extends BudgetRow
{
  amountsYear: AmountPerYear[];
}
