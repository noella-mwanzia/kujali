import * as _ from 'lodash';

import { BudgetTypeAggregator } from './budget-type-aggregator.model';
import { SingleResultCalculator } from './single-result-calculator.model';
import { BudgetLine } from '../model/budget-line.interface';
import { BudgetGroup } from '../model/budget-group.interface';
import { BudgetRowType } from '../../table-rows/budget-row-type.type';
import { Budget } from '../../../transactions/budget.interface';


/** Algorithm that turns a list of budget lines into an actual budget. */
export class BudgetAggregator
{
  private _budgetTypeAggregator = new BudgetTypeAggregator();
  private _singleResultCalculator = new SingleResultCalculator();

  constructor() { }

  /**
   * Structures Budget Lines into an actual budget.
   * 
   * @param lines Unstructured Budget Lines
   */
  public aggregateBudget(budget: Budget, lines: BudgetLine[], type: 'cost' | 'income'): BudgetGroup
  {
    return this._groupByType(budget, lines, type, _.capitalize(type));
  }

  private _groupByType(budget: Budget, lines: BudgetLine[], type: string, name: string): BudgetGroup
  {
    const relevantLines = _.filter(lines, entry => entry.transaction.transactionCategoryType === type);
    const typeCategories = this._budgetTypeAggregator.group(budget, "category", relevantLines, false);

    return this._singleResultCalculator.calculateTotalFromGroups(typeCategories, <BudgetRowType>(type + 'Total'), name);
  }

}