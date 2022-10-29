import { BudgetRow } from "@app/model/finance/planning/budget-lines";
import { Budget } from "@app/model/finance/planning/budgets";

import { AggregatedBudget } from "./aggregated-budget.interface";
import { RenderedChildBudget } from "./rendered-child-budget.interface";

/**
 * A budget which has been rendered by the budget-calculator.
 * 
 * - Contains all calculated values of the budget.
 * - Represented as a 2D array of budget rows and results
 * - Contains the header information.
 */
export interface RenderedBudget extends Budget, AggregatedBudget
{
  /** Years over which the budget ranges */
  years: number[];

  // Budget result header 

  /** Child results row. Result of child budgets line by line */
  children: RenderedChildBudget[];

  /** Result line of this budget (SUM COST, INCOME, SUM(...RESULTS)) */
  result: BudgetRow;

  /** Balance - Cashflow forecasting */
  balance: BudgetRow;
}
