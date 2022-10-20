
import { BudgetResult, BudgetRowType } from "@app/model/finance/planning/budget-lines";
import { NULL_BUDGET_HEADER } from "./budget-header.null";

export function NULL_BUDGET_RESULT_MONTH(orgId: string, budgetId: string): BudgetResult
{
  return {
    id: '0',
    name: 'Empty Child',
    orgId,
    budgetId,
    costTotals: NULL_BUDGET_HEADER('Total Cost', BudgetRowType.CostTotal, 2022, 5),
    incomeTotals: NULL_BUDGET_HEADER('Total Income', BudgetRowType.IncomeTotal, 2022,5),

    result: NULL_BUDGET_HEADER('Result', BudgetRowType.Result, 2022, 5),

    balance: NULL_BUDGET_HEADER('Balance', BudgetRowType.Balance, 2022, 5),
    childResults: [],

    version: 0,
    createdBy: '0',
    createdOn: new Date()
  }
}