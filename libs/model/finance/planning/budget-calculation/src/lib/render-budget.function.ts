import { cloneDeep as ___cloneDeep, range as ___range } from "lodash";

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
export function ___RenderBudget(b: Budget, lines: BudgetLine[]) : RenderedBudget
{
  const renderedBudget = ___cloneDeep(b) as RenderedBudget;

  // Budget specific const and income streams
  const costs  = __GroupBudgetLinesByType(b, lines, BudgetRowType.CostLine);
  const income = __GroupBudgetLinesByType(b, lines, BudgetRowType.IncomeLine);

  renderedBudget.costs      = __RenderLinesGroup(costs, b);
  renderedBudget.costTotals = __RecordToHeader(costs, b);

  renderedBudget.income       = __RenderLinesGroup(income, b);
  renderedBudget.incomeTotals = __RecordToHeader(income, b);
  
  // Budget scoping

  renderedBudget.years =  ___range(b.startYear, b.startYear + b.duration);

  return renderedBudget;
}
