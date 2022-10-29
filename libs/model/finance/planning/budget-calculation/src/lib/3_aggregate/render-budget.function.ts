import { cloneDeep as ___cloneDeep, range as ___range } from "lodash";

import { Budget } from "@app/model/finance/planning/budgets";
import { BudgetRowType } from "@app/model/finance/planning/budget-lines";
import { AggregatedBudget, RenderedBudget, RenderedChildBudget } from "@app/model/finance/planning/budget-rendering";

import { __MergeBudgetLinesOfNHeaders } from "../utils/merge-lines.util";
import { __CalculateResultBalance } from "./calculate-result-balance.function";

/**
 * Transforms the aggregated budget into a table consumable by the front ends budget explorer,
 *  as well as by analysis tools such as matrix calculators.
 * 
 * Basically creates a 2D representation of the budget.
 */
export function __RenderBudget(b: Budget, children: RenderedChildBudget[], budgetLines: AggregatedBudget) : RenderedBudget
{
  const renderedBudget = ___cloneDeep(b) as RenderedBudget;

  renderedBudget.income       = budgetLines.income;
  renderedBudget.incomeTotals = budgetLines.incomeTotals;

  renderedBudget.costs      = budgetLines.costs;
  renderedBudget.costTotals = budgetLines.costTotals;
  
  // Budget scoping
  renderedBudget.years =  ___range(b.startYear, b.startYear + b.duration);

  // Result calculation
  renderedBudget.children = children;

  // Result calculation
   
  const resultLines = [renderedBudget.incomeTotals, renderedBudget.costTotals].concat(children.map(c => c.header));

  renderedBudget.result = __MergeBudgetLinesOfNHeaders('BUDGETS.HEADERS.RESULT', 
                                                       BudgetRowType.Result, renderedBudget.startYear, renderedBudget.duration, 
                                                       resultLines);
  renderedBudget.balance = __CalculateResultBalance('BUDGETS.HEADERS.BALANCE', BudgetRowType.Balance,
                                                    renderedBudget, renderedBudget.result);

  return renderedBudget;
}
