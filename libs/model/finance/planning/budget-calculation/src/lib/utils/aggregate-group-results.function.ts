import { BudgetRow } from "@app/model/finance/planning/budget-lines";
import { BudgetRowType } from "@app/model/finance/planning/budget-grouping";
import { BudgetGroup } from "@app/model/finance/planning/budget-rendering";

import { __MergeBudgetLinesOfTwoGroupResults } from "./merge-lines.util";

/** 
 * Algorithm that can calculate balances/cashflows of a budget by reducing BudgetGroups.
 * Used to generate result lines of a group.
 * 
 *    Worsk by reducing budget lines/constructs(groups) to a SUM line (sums by month).
 *
 * @param budgetGroups - All the budget lines/constructs to SUM into a new line
 * @param type         - Type of line to create (for the aggregate line)
 * @param totalName    - Name of the line to create
 * 
 * 
 * @note - If this is used to calculate a complete budget balance, parent budgets need to be notified. The balance becomes a child result line in the parents.
 */
export function __CalculateBalanceOfGroups(budgetGroups: (BudgetGroup | BudgetRow)[], type: BudgetRowType, totalName: string): BudgetGroup
{
  const amountByYearAndMonth = budgetGroups
                                  .map(t => t.amountsYear)
                                  .reduce((prev, curr) => __MergeBudgetLinesOfTwoGroupResults(prev, curr), []);
  
  return {
    name: totalName,

    isGroup: true,

    amountsYear: amountByYearAndMonth ? amountByYearAndMonth : [],
    type,

    children: budgetGroups
  };
}
