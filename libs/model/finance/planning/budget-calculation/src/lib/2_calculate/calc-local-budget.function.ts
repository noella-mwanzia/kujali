import { Budget } from "@app/model/finance/planning/budgets";
import { AggregatedBudget, BudgetLineRow } from "@app/model/finance/planning/budget-rendering";

import { BudgetRowType } from "@app/model/finance/planning/budget-lines";

import { __GroupBudgetLinesByType } from "./group-lines-by-type";
import { __RecordToHeader, __RenderLinesGroup } from "./render-groups.functions";

/**
 * Transforms a list of budget lines into a table consumable by the front ends budget explorer,
 *  as well as by analysis tools such as matrix calculators.
 * 
 * Basically creates a 2D representation of the budget.
 */
export function ___CalculateLocalBudget(b: Budget, lines: BudgetLineRow[]) : AggregatedBudget
{
  // Budget specific const and income streams
  const costs  = __GroupBudgetLinesByType(b, lines, BudgetRowType.CostLine);
  const income = __GroupBudgetLinesByType(b, lines, BudgetRowType.IncomeLine);

  return {
    costs      : __RenderLinesGroup(costs, b),
    costTotals : __RecordToHeader(costs, b),

    income       : __RenderLinesGroup(income, b),
    incomeTotals : __RecordToHeader(income, b)
  };
}
