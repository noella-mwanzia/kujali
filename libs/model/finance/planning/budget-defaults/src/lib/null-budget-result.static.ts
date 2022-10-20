
import { BudgetResult, BudgetRowType } from "@app/model/finance/planning/budget-lines";
import { NULL_BUDGET_HEADER } from "./budget-header.null";

/**
 * Default budget generator.
 *  - Generates the default result header for new budgets
 * 
 * @param orgId     - Organisation ID
 * @param budgetId  - Budget ID
 * @param startYear - Start year of the budget
 * @param duration  - Duration (in years) of the budget
 * @returns 
 */
export function NULL_BUDGET_RESULT_MONTH(orgId: string, budgetId: string, startYear = 2023, duration = 5): BudgetResult
{
  return {
    id: '0',
    name: 'Empty Child',
    orgId,
    budgetId,                                                           
    costTotals: NULL_BUDGET_HEADER('Total Cost', BudgetRowType.CostTotal, startYear, duration),
    incomeTotals: NULL_BUDGET_HEADER('Total Income', BudgetRowType.IncomeTotal, startYear, duration),

    result: NULL_BUDGET_HEADER('Result', BudgetRowType.Result, startYear, duration),

    balance: NULL_BUDGET_HEADER('Balance', BudgetRowType.Balance, startYear, duration),
    childResults: [],

    version: 0,
    createdBy: '0',
    createdOn: new Date()
  }
}