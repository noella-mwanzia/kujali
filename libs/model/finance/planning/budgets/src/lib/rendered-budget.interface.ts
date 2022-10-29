import { BudgetHeader, BudgetRow } from "@app/model/finance/planning/budget-lines";
import { Budget } from "./budget.interface";

/**
 * A budget which has been rendered by the budget-calculator.
 * 
 * - Contains all calculated values of the budget.
 * - Represented as a 2D array of budget rows and results
 */
export interface RenderedBudget extends Budget
{
  /** Cost lines of the budget */
  costs: BudgetRow[];
  /** Cost total - Budget header on top of cost categories */
  costTotals: BudgetHeader;

  /** Income lines of the budget */
  income: BudgetRow[];
  /** Income total - Budget header on top of income categories */
  incomeTotals: BudgetHeader;

  /** Years over which the budget ranges */
  years: number[];
}
