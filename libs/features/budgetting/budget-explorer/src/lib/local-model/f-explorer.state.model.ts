import { RenderedBudget } from "@app/model/finance/planning/budgets";

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

  loaded: false
}) as FinancialExplorerState;

/** 
 * Set the page view to the first financial year. 
 * 
 * We start on today's year if a history of years is added. This makes viewing budgets easier especially over platform usage of n years.
*/
export function _FIRST_YEAR_OF_BUDGET(b: RenderedBudget): number 
{
  return (new Date().getFullYear() >= b.startYear ? new Date().getFullYear() : b.startYear);
}