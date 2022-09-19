import { map as ___map, reduce as ___reduce, orderBy as ___orderBy, groupBy as ___groupBy } from 'lodash';

import { Budget, BudgetRowType } from "@kujali/model/finance/planning/budgets";
import { NULL_AMOUNT_BY_YEAR_AND_MONTH } from '@kujali/model/finance/planning/budget-defaults';

import { BudgetGroup } from "../model-stubs/budget-group.interface";
import { BudgetLine } from "../model-stubs/budget-line.interface";

import { AmountPerYearReducer } from "./amount-per-year.reducer";

/**
 * Class which hold the algorithm that can hierarchically structure budget lines.
 */
export class BudgetTypeAggregator
{
  private _amountReducer = new AmountPerYearReducer();

  /**
   * Create Higher Order Grouping by grouping budget lines by category.
   *  After grouping, aggregates the budget lines together.
   * 
   * @name: 
   * @param linesToGroup A collection of budget lines that belong together in one of the highest categories: Income, Cost, Equity, ...
   */
  public group(budget: Budget, type: BudgetRowType, linesToGroup: BudgetLine[], name: string | false): BudgetGroup[]
  {
    const groupedAndOrdered = ___groupBy(___orderBy(linesToGroup, e => e.transaction.name),
                                        e => e.transaction.transactionCategoryId);

    let groups = Object.entries(groupedAndOrdered);
    groups = ___orderBy(groups, (group) => group[1][0].transaction.transactionCategoryOrder);

    return ___map(groups, group => this._structureFromGroups(budget, type, group[1], name));
  }

  private _structureFromGroups(budget: Budget, type: BudgetRowType, entriesInGroup: BudgetLine[], name: string | false): BudgetGroup
  {
    const amountByYearGroup = ___reduce(___map(entriesInGroup, entry => entry.amountsYear),
                                      (prev, curr) => this._amountReducer.reduceAmounts(prev, curr));
    return {
      isGroup: true,

      name: name ? name : entriesInGroup[0].transaction.transactionCategoryName,
      type,

      amountsYear: amountByYearGroup ? amountByYearGroup : NULL_AMOUNT_BY_YEAR_AND_MONTH(budget.startYear, budget.duration),

      children: entriesInGroup
    };
  }

}
