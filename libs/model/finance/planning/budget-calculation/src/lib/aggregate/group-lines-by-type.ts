import { Budget } from '@app/model/finance/planning/budgets';
import { BudgetRowType } from '@app/model/finance/planning/budget-lines';
import { BudgetGroup, BudgetLine } from '@app/model/finance/planning/budget-rendering';

import { __GroupBudgetLines } from './workers/group-lines.util';
import { __CalculateBalanceOfGroups } from './workers/aggregate-group-results.function';

/**
 * Structures Budget Lines into an actual budget.
 *  Algorithm turns a list of budget lines into an actual budget
 * 
 * @param lines Unstructured Budget Lines belong to the budget to render.
 */
export function __GroupBudgetLinesByType(budget: Budget, lines: BudgetLine[], type: BudgetRowType.CostLine| BudgetRowType.IncomeLine): BudgetGroup
{
  return _groupByType(budget, lines, type);
}

  function _groupByType(budget: Budget, lines: BudgetLine[], type: BudgetRowType): BudgetGroup
  {
    const relevantLines = lines.filter(entry => entry.transaction.transactionCategoryType === type);
    const typeCategories = __GroupBudgetLines(budget, BudgetRowType.Category, relevantLines, false);

    return __CalculateBalanceOfGroups(typeCategories, type, _getLineName(type));
  }

  function _getLineName(type: BudgetRowType)
  {
    switch(type)
    { 
      case BudgetRowType.CostLine   : return 'BUDGETTING.LINES.COST'; 
      case BudgetRowType.IncomeLine : return 'BUDGETTING.LINES.INCOME';
    }
  }
