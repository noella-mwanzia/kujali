import { BudgetResult } from "@app/model/finance/planning/budget-lines";
import { BudgetRowYear } from "./budget-row-year.interface";

/**
 * Result header. An aggregate of budget lines totalling the budget amount.
 */
export interface BudgetResultYear extends BudgetResult
{
  year: number;
  yearCostTotals: BudgetRowYear;
  yearIncomeTotals: BudgetRowYear;

  yearChildResults: BudgetRowYear[];

  yearResult: BudgetRowYear;
  yearBalance: BudgetRowYear;

}
