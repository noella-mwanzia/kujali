import { capitalize as ___capitalize } from 'lodash';

import { Budget } from '@app/model/finance/planning/budgets';
import { BudgetRowType } from '@app/model/finance/planning/budget-lines';
import { BudgetGroup, BudgetLine } from '@app/model/finance/planning/budget-rendering';
import { __GroupBudgetLines } from './budget-type-aggregator.model';
import { __CalculateBalanceOfGroups } from './single-result-calculator.model';


/**
 * Structures Budget Lines into an actual budget.
 *  Algorithm turns a list of budget lines into an actual budget
 * 
 * @param lines Unstructured Budget Lines belong to the budget to render.
 */
export function __AggregateBudget(budget: Budget, lines: BudgetLine[], type: BudgetRowType.CostLine| BudgetRowType.IncomeLine): BudgetGroup
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
