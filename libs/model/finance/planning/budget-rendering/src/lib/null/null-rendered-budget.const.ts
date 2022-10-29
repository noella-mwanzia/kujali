import { RenderedBudget } from "@app/model/finance/planning/budgets";

/**
 * @returns a skeleton on which to place a rendered budget.
 */
export const NULL_RENDERED_BUDGET : () => RenderedBudget 
    = () => ({ budgetId: 'loading', orgId: 'loading' , 
               name: 'loading', costs: [], income: [], costTotals: null, incomeTotals: null });
