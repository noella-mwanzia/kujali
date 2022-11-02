import { AggregatedBudget } from '../aggregated-budget.interface';

/**
 * @returns a skeleton on which to place a rendered budget.
 */
export const NULL_RENDERED_BUDGET : () => AggregatedBudget 
= () => (
   <unknown>{ 
        budgetId: 'loading', orgId: 'loading' , 
        name: 'loading', costs: [], income: [], costTotals: null, incomeTotals: null }
    ) as AggregatedBudget;
