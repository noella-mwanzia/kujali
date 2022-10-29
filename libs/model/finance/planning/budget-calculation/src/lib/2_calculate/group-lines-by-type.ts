import { Budget } from '@app/model/finance/planning/budgets';
import { BudgetRowType } from '@app/model/finance/planning/budget-lines';
import { BudgetGroup, BudgetLineRow } from '@app/model/finance/planning/budget-rendering';

import { __GroupBudgetLines } from '../utils/group-lines.util';
import { __CalculateBalanceOfGroups } from '../utils/aggregate-group-results.function';

/**
 * Structures Budget Lines into an actual budget.
 *  Algorithm turns a list of budget lines into an actual budget
 * 
 * @param lines Unstructured Budget Lines belong to the budget to render.
 */
export function __GroupBudgetLinesByType(budget: Budget, lines: BudgetLineRow[], type: BudgetRowType.CostLine| BudgetRowType.IncomeLine): BudgetGroup
{
  return _groupByType(budget, lines, type);
}

  function _groupByType(budget: Budget, lines: BudgetLineRow[], type: BudgetRowType): BudgetGroup
  {
    const relevantLines = lines.filter(entry => entry.config.transactionCategoryType === type);
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
