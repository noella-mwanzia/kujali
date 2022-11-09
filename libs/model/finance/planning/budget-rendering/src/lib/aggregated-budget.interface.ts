import { BudgetRow } from "@app/model/finance/planning/budget-lines";

/**
 * A budget which has been aggregated and structured by the budget-calculator.
 * 
 * - Contains all calculated values of the budget.
 * - Represented as a 2D array of budget rows and results
 * 
 * @note - Only used in the calculator
 */
export interface AggregatedBudget
{
  /** Cost lines of the budget */
  costs: BudgetRow[];
  /** Cost total - Budget header on top of cost categories */
  costTotals: BudgetRow;

  /** Income lines of the budget */
  income: BudgetRow[];
  /** Income total - Budget header on top of income categories */
  incomeTotals: BudgetRow;
}
