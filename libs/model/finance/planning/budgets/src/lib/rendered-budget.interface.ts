import { BudgetHeader } from "./budget-header.interface";
import { BudgetRow } from "./budget-row.interface";

/**
 * A budget which has been rendered by the budget-calculator.
 * 
 * - Contains all calculated values of the budget.
 */
export interface RenderedBudget
{
  budgetId: string;

  name: string;

  costs: BudgetRow[];
  costTotals: BudgetHeader;

  income: BudgetRow[];
  incomeTotals: BudgetHeader;
}
