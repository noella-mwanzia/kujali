import { HandlerTools } from "@iote/cqrs";

import { BudgetHeaderResult } from "@app/model/finance/planning/budget-lines";
import { RenderedBudget } from "@app/model/finance/planning/budget-rendering";

/**
 * Transforms a rendered budget into a budget header result
 * @param budget 
 * @param tools 
 * @returns 
 */
export function createBudgetHeaderResult(budget: RenderedBudget, tools: HandlerTools): BudgetHeaderResult {
  let header: BudgetHeaderResult  = {
    id: Math.floor(Date.now() / 1000).toString(),
    orgId: budget.orgId,
    name: budget.name,
    budgetId: budget.id!,
    startY: budget.years[0],
    duration: budget.duration,
    headers: {},
    years: budget.years
  }
  
  budget.result.amountsYear.forEach((yearValues) => {
    let year = yearValues.year;
    header.headers[year] = yearValues.amountsMonth.map((months) => months.amount);
  });
  
  return header;
}