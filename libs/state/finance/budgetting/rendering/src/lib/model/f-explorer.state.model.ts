import { range as ___range } from 'lodash'; 

import { Budget } from "@app/model/finance/planning/budgets";
import { AmountPerYear } from '@app/model/finance/planning/budget-lines';
import { RenderedBudget } from "@app/model/finance/planning/budget-rendering";

import { BudgetRowYear } from '@app/model/finance/planning/budget-lines-by-year';

/**
 * This model manages the financial year explorer state.
 *  
 * It controls:
 *  - The year to visualize
 *  - The active budget
 * 
 * @exposes Several observables which depict the current state, as well as methods to update the state.
 */
export interface FinancialExplorerState
{
  /** Active year to focus on */
  year: number;

  /** Scoped incomes (to year) */
  scopedIncome: BudgetRowYear[];
  /** Scoped costs  (to year)*/
  scopedCosts: BudgetRowYear[];
  /** Scoped Income results (to year) */
  scopedIncomeTotals: BudgetRowYear;
  /** Scoped cost results (to year) */
  scopedCostTotals: BudgetRowYear;
  /** Scoped child budgets (to year) */
  scopedChildBudgets: BudgetRowYear[];
  /** Result scoped to year */
  scopedResult: BudgetRowYear;
  /** Balance scoped to year */
  scopedBalance: BudgetRowYear;

  /** Range of years available to the budget */
  years: number[];
  /** The rendered budget we are editing. */
  budget: RenderedBudget;
  
  /** Whether the state has been loaded */
  loaded: boolean;
}

export const _DEFAULT_FINANCIAL_EXPLORER_STATE = () => ({
  year: 0,
  budget: <unknown> null as RenderedBudget,
  years: [],
  
  activeYear: <unknown> null as AmountPerYear,

  loaded: false
}) as unknown as FinancialExplorerState;

/** 
 * Set the page view to the first financial year. 
 * 
 * We start on today's year if a history of years is added. This makes viewing budgets easier especially over platform usage of n years.
*/
export function _FIRST_YEAR_OF_BUDGET(b: Budget): number 
{
  return (new Date().getFullYear() >= b.startYear ? new Date().getFullYear() : b.startYear);
}

/** 
 * Set the date range of years regarding a budget.
*/
export function _YEARS_RANGE_OF_BUDGET(b: Budget) 
{
  return ___range(b.startYear, b.startYear + b.duration);
}