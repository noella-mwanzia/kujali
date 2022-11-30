import { MONTHS } from "@app/model/finance/planning/time";


import { BudgetRowType } from "@app/model/finance/planning/budget-grouping";
import { AmountPerYear } from "@app/model/finance/planning/budget-lines";
import { BudgetRowYear } from "@app/model/finance/planning/budget-lines-by-year";

import { FinancialExplorerState } from '@app/model/finance/planning/budget-rendering-state';

const COLOR_RANGES = ['#7986cb', '#3f51b5', '#666ad1', '#001970', '#536dfe', '#26c6da', '#0097a7'];

export function ___CreateGraphBalanceLine(balance: BudgetRowYear) 
{ 
  return _flatMapAmountsPerYear(balance.amountsYear); 
}

  // Region: Chart Data

  function _flatMapAmountsPerYear(amounts: AmountPerYear[], absolute?: boolean)
  {
    return amounts                         // Enable to show values like cost positively.
              .map(year => year.amountsMonth.map(a => absolute ? Math.abs(a.amount) : a.amount))
              .reduce((prev, curr) => prev.concat(curr));
  }
 
export function ___CreateGraphBlocks(result: FinancialExplorerState) 
{
  return [
    _toGraphBlock(result.scopedResult, 0),
    _toGraphBlock(result.scopedCostTotals, 1, true),
    _toGraphBlock(result.scopedIncomeTotals, 2)
  ]
  .concat(result.scopedChildBudgets.map((chr, i2) => _toGraphBlock(chr, 3 + i2, false, true)));
}

  function _toGraphBlock(row: BudgetRowYear, i: number, absolute?: boolean, hidden?: boolean)
  {  
    return {
      label: row.name,
      data:            _flatMapAmountsPerYear(row.amountsYear, absolute),
      backgroundColor: _chooseBackgroundColor(row.type as BudgetRowType, i),
      borderColor:     _chooseBorderColor    (row.type as BudgetRowType),
      hidden: hidden
    };
  }

export function ___CreateGraphLabels(timeSkeleton: AmountPerYear[]): string[]
{
  const labels: string[] = [];
  for (const year of timeSkeleton)
  {
    labels.push(year.year + ' - jan');
    for (let i = 1; i < year.amountsMonth.length; i++)
      labels.push(MONTHS[i].slug);
  }

  return labels;
}

  // Region: Color
  
  function _chooseBackgroundColor(type: BudgetRowType, index: number)
  {
    switch (type) {
      case BudgetRowType.IncomeTotal: return 'rgba(81,150,87, 0.5)';
      case BudgetRowType.CostTotal: return 'rgba(175,68,72, 0.5)';
      case BudgetRowType.Result: return 'rgba(34,134,195, 0.5)';
      default:
        return _selectColor(index);
    }
  }

  function _chooseBorderColor(type: BudgetRowType) {
    switch (type) {
      case BudgetRowType.IncomeTotal: return '#519657';
      case BudgetRowType.CostTotal: return '#af4448';
      case BudgetRowType.Result: return '#2286c3';
      default:
        return 'gray';
    }
  }
  
  function _selectColor(i: number) {
    return COLOR_RANGES[i % COLOR_RANGES.length];
  }
