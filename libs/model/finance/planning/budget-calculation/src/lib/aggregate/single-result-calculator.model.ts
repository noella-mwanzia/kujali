import { BudgetHeader, BudgetRowType } from "@app/model/finance/planning/budgets";

import { BudgetGroup } from "../model-stubs/budget-group.interface";
import { AmountPerYearReducer } from "./amount-per-year.reducer";

/** 
 * Algorithm that can calculate balances/cashflows of a budget by reducing BudgetGroups.
 *    Once a result is calculated, it needs to be updated in the parents as well.
 */
export class SingleResultCalculator
{
  private _reducer = new AmountPerYearReducer();

  /**
   * 
   * @param budgetGroups 
   * @param typeSlug 
   * @param totalName 
   */
  public calculateTotalFromGroups(budgetGroups: (BudgetGroup | BudgetHeader)[], typeSlug: BudgetRowType, totalName: string): BudgetGroup
  {
    const amountByYearAndMonth = budgetGroups
                                    .map(t => t.amountsYear)
                                    .reduce((prev, curr) => this._reducer.reduceAmounts(prev, curr));
    
    return {
      name: totalName,

      isGroup: true,

      amountsYear: amountByYearAndMonth ? amountByYearAndMonth : [],
      type: typeSlug,

      children: budgetGroups
    };
  }


}