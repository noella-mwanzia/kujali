import { BudgetHeader, BudgetRow } from "@app/model/finance/planning/budget-lines";

/**
 * A budget which has been rendered by the budget-calculator.
 * 
 * - Contains all calculated values of the budget.
 */
export interface RenderedBudget
{
  budgetId: string;
  orgId: string;

  name: string;

  costs: BudgetRow[];
  costTotals: BudgetHeader;

  income: BudgetRow[];
  incomeTotals: BudgetHeader;
}
