import { BudgetResult } from "@app/model/finance/planning/budget-lines";
import { BudgetRowYear } from "@app/model/finance/planning/budget-lines-by-year";

/**
 * Result header. An aggregate of budget lines totalling the budget amount.
 */
export interface BudgetOverviewChartData // extends BudgetResult
{
  /** Budget Id */
  bId: string;
  /** Active/visualized year */
  year: number;
  /** Total costs for year */
  yearCostTotals: BudgetRowYear;
  /** Total income for year */
  yearIncomeTotals: BudgetRowYear;
  /** Child results */
  yearChildResults: BudgetRowYear[];
  
  /** Budget result */
  yearResult: BudgetRowYear;
  /** Year balance */
  yearBalance: BudgetRowYear;

}

export function __CreateBudgetOverviewChartData(
  bId: string, year: number, yearCostTotals: BudgetRowYear, yearIncomeTotals: BudgetRowYear,
  yearChildResults: BudgetRowYear[], yearResult: BudgetRowYear, 
  yearBalance: BudgetRowYear
  ) : BudgetOverviewChartData
{
  return {
    bId, year, yearCostTotals, yearIncomeTotals,
    yearChildResults, yearResult, yearBalance
  };
}
