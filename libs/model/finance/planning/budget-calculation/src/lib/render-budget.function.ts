

import { Budget, RenderedBudget } from "@app/model/finance/planning/budgets";
import { BudgetLine } from "@app/model/finance/planning/budget-rendering";

import { __RenderLinesGroup, __RecordToHeader } from './render-groups.functions';
import { __GroupBudgetLinesByType } from "./aggregate/group-lines-by-type";
import { BudgetRowType } from "@app/model/finance/planning/budget-lines";

/**
 * Transforms the aggregated budget into a table consumable by the front ends budget explorer,
 *  as well as by analysis tools such as matrix calculators.
 * 
 * Basically creates a 2D representation of the budget.
 */
export function ___RenderBudget(budget: Budget, lines: BudgetLine[]) : RenderedBudget
{
  const costs  = __GroupBudgetLinesByType(budget, lines, BudgetRowType.CostLine);
  const income = __GroupBudgetLinesByType(budget, lines, BudgetRowType.IncomeLine);

  return {
    budgetId: <string> budget.id,
    orgId: budget.id,

    name: budget.name,

    costs: __RenderLinesGroup(costs, budget),
    costTotals: __RecordToHeader(costs, budget),

    income: __RenderLinesGroup(income, budget),
    incomeTotals: __RecordToHeader(income, budget)
  };
}
