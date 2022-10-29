import { cloneDeep as __cloneDeep } from "lodash";

import { BudgetRow, BudgetRowType } from "@app/model/finance/planning/budget-lines";
import { RenderedBudget } from "@app/model/finance/planning/budget-rendering";

/**
 * Method which calculates a line balance or in other words a line's cashflow.
 * 
 * @name - Name of the balance row
 * @type - Row type can only be balance
 * @budget - Budget to attach this too
 * @resultLine - Result line (final line of the budget with month-on-month movements) to use for calculation of the CF
 */
export function __CalculateResultBalance(name: string, type: BudgetRowType.Balance, budget: RenderedBudget, resultLine: BudgetRow) : BudgetRow
{
  let balance = 0;

  const cashflow = __cloneDeep(resultLine.amountsYear);

  // Deep for-loop which calculates the CF balance sequentially, month on month.
  for(let rowIdx = 0; rowIdx <= cashflow.length; rowIdx++)
    for(let colIdx = 0; colIdx <= cashflow[rowIdx].amountsMonth.length; colIdx)
  {
    balance = balance + cashflow[rowIdx][colIdx];
    cashflow[rowIdx][colIdx] = balance;
  }

  return {
    name, type,
    isGroup: true, isHeader: true,
    amountsYear: cashflow,
  };
}