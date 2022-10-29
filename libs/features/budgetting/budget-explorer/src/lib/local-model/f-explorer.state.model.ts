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
  /** The rendered budget we are editing. */
  budget: RenderedBudget;

  /** Whether the state has been loaded */
  loaded: boolean;
}

export const _DEFAULT_FINANCIAL_EXPLORER_STATE = () => ({
  year: 0,
  budget: <unknown> null as RenderedBudget,

  loaded: false
})

/** Set the page view to the first financial year */
export function _FIRST_YEAR_OF_BUDGET(budget: RenderedBudget): number 
{
  // Get the financial years from the budget header rows as we are sure those are set.
  if(!budget.costTotals || budget.costTotals.amountsYear.length === 0)
    throw new Error('FES02 - Cannot visualize budget table as the budget has no financial years.');

  return budget.costTotals.amountsYear[0].year;
}