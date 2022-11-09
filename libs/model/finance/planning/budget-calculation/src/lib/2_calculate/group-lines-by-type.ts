import { Budget } from '@app/model/finance/planning/budgets';
import { BudgetRowType } from '@app/model/finance/planning/budget-grouping';
import { BudgetGroup, BudgetLineRow } from '@app/model/finance/planning/budget-rendering';

import { __GroupBudgetLines } from '../utils/group-lines.util';
import { __CalculateBalanceOfGroups } from '../utils/aggregate-group-results.function';
import { NULL_BUDGET_HEADER } from '@app/model/finance/planning/budget-defaults';

/**
 * Structures Budget Lines into an actual budget.
 *  Algorithm turns a list of budget lines into an actual budget
 * 
 * @param lines Unstructured Budget Lines belong to the budget to render.
 */
export function __GroupBudgetLinesByType(budget: Budget, lines: BudgetLineRow[], type: BudgetRowType.CostLine| BudgetRowType.IncomeLine): BudgetGroup
{
  const lineName = _getLineName(type);
  const baseLine = NULL_BUDGET_HEADER(lineName, type, budget.startYear, budget.duration);

  const linesToReduce = [baseLine].concat(lines) as BudgetLineRow[];

  return _groupByType(budget, lineName, linesToReduce, type);
}

  function _groupByType(budget: Budget, lineName: string, lines: BudgetLineRow[], type: BudgetRowType): BudgetGroup
  {
    const relevantLines = lines.filter(entry => entry.type === type);
    const typeCategories = __GroupBudgetLines(budget, BudgetRowType.Category, relevantLines, false);

    return __CalculateBalanceOfGroups(typeCategories, type, lineName);
  }

  function _getLineName(type: BudgetRowType)
  {
    switch(type)
    { 
      case BudgetRowType.CostLine   : return 'BUDGETTING.LINES.COST'; 
      case BudgetRowType.IncomeLine : return 'BUDGETTING.LINES.INCOME';
    }
    return '';
  }
