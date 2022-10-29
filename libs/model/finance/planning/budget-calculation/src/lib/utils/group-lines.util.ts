import { map as ___map, reduce as ___reduce, orderBy as ___orderBy, groupBy as ___groupBy } from 'lodash';

import { Budget } from "@app/model/finance/planning/budgets";
import { NULL_AMOUNT_BY_YEAR_AND_MONTH } from '@app/model/finance/planning/budget-defaults';

import { BudgetRowType } from '@app/model/finance/planning/budget-lines';
import { BudgetGroup, BudgetLineRow } from '@app/model/finance/planning/budget-rendering';

import { __MergeBudgetLinesOfTwoLines } from './merge-lines.util';

/**
 * Algorithm which can hierarchically structure budget lines into groups.
 * 
 * Creates Higher Order Grouping by grouping budget lines by category.
 *  After grouping, aggregates the budget lines together.
 * 
 * @name: name of the new group
 * @param linesToGroup A collection of budget lines that belong together in one of the highest categories: Income, Cost, Equity, ...
 */
export function __GroupBudgetLines(budget: Budget, type: BudgetRowType, linesToGroup: BudgetLineRow[], name: string | false): BudgetGroup[]
{
  const groupedAndOrdered = ___groupBy(___orderBy(linesToGroup, e => e.transaction.name),
                                      e => e.transaction.transactionCategoryId);

  let groups = Object.entries(groupedAndOrdered);
  groups = ___orderBy(groups, (group) => group[1][0].transaction.transactionCategoryOrder);

  return ___map(groups, group => _structureFromGroups(budget, type, group[1], name));
}

  function _structureFromGroups(budget: Budget, type: BudgetRowType, entriesInGroup: BudgetLineRow[], name: string | false): BudgetGroup
  {
    const amountByYearGroup = ___reduce(___map(entriesInGroup, entry => entry.amountsYear),
                                      (prev, curr) => __MergeBudgetLinesOfTwoLines(prev, curr));
    return {
      isGroup: true,

      name: name ? name : entriesInGroup[0].transaction.transactionCategoryName,
      type,

      amountsYear: amountByYearGroup ? amountByYearGroup : NULL_AMOUNT_BY_YEAR_AND_MONTH(budget.startYear, budget.duration),

      children: entriesInGroup
    };
  }
