import { BudgetRow } from "@kujali/model/finance/planning/budgets";

/** 
 * Hierarchical Grouping of Budgets.
 * 
 * Our calculator first hierarchically structures the budget, then flattens and aggregates it into a single table.
 */
export interface BudgetGroup extends BudgetRow 
{
  children: BudgetRow[];
}
