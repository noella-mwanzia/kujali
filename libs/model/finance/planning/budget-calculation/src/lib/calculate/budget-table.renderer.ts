

import { Budget, RenderedBudget } from "@kujali/model/finance/planning/budgets";
import { BudgetGroup } from "../model-stubs/budget-group.interface";
import { RecordsToTable, RecordToHeader } from "./table-render-tools.functions";

/**
 * Transforms the aggregated budget into a table consumable by the front end.
 */
export class BudgetTableRenderer 
{
  /**
   * Transform an aggregated budget into a table consumable by the front end.
   */
  render(budget: Budget, costs: BudgetGroup, income: BudgetGroup): RenderedBudget
  {
    return {
      budgetId: <string> budget.id,

      name: budget.name,

      costs: RecordsToTable(costs, budget),
      costTotals: RecordToHeader(costs, budget),

      income: RecordsToTable(income, budget),
      incomeTotals: RecordToHeader(income, budget)
    };
  }

  renderGroup(group: BudgetGroup, budget: Budget) {
    return {
      table: RecordsToTable(group, budget),
      header: RecordToHeader(group, budget)
    };
  }

}
