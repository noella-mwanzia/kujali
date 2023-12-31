import { map as ___map, sum as ___sum, reduce as ___reduce } from 'lodash';

import { MONTHS } from '@app/model/finance/planning/time';

import { BudgetRowType } from '@app/model/finance/planning/budget-grouping';
import { AmountPerMonth, AmountPerYear, BudgetRow } from '@app/model/finance/planning/budget-lines';

import { NULL_AMOUNT_PER_MONTH, NULL_BUDGET_HEADER } from '@app/model/finance/planning/budget-defaults';

/**
 * Algorithm that can merge two Budget Groups together by adding up their amounts.
 * Merge two budget groups amounts (Left merge, will copy over unaggregatable things from the leftmost occurence. ) 
 */
export function __MergeBudgetLinesOfTwoGroupResults(target: AmountPerYear[], source: AmountPerYear[]) : AmountPerYear[]
{
  return __MergeBudgetLinesOfTwoLines(target, source);
}

/**
 * Util for merging rendered header-rows together.
 * 
 * @param name - Header name to produce
 * @param type - Header type to produce
 * @param startYear - Start year of the budget
 * @param duration  - n years to take.
 * @param headersToMerge - The headers to merge to produce this line.
 * 
 * @returns {BudgetRow} - Rendered budget row
 */
export function __MergeBudgetLinesOfNHeaders(name: string, type: BudgetRowType, year: number, duration: number, headersToMerge: BudgetRow[]) 
{
  //  The template row after which to model everything except the . This functionality
  const template = NULL_BUDGET_HEADER(name, type, year, duration);

  return ___reduce(
    headersToMerge, 
    ((template, currH) => {
      const mrgdAmounts = __MergeBudgetLinesOfTwoLines(template.amountsYear, currH?.amountsYear ?? []);
      template.amountsYear = mrgdAmounts;
      return template;
    }), 
    template);
}

/** 
 * Algorithm that can merge two Budget Lines together by adding up their amounts.
 * Merge two budget line amounts (Left merge, will copy over unaggregatable things from the leftmost occurence. ) 
 */
export function __MergeBudgetLinesOfTwoLines(target: AmountPerYear[], source: AmountPerYear[]) : AmountPerYear[]
{
  const resultTable: AmountPerYear[] = [];

  if(!source)
    return target;

  if (target)
  {
    if      (target.length > source.length) source = _syncYears(target, source);
    else if (source.length > target.length) target = _syncYears(source, target);

    for (let i = 0; i < target.length; i++) {
      const addedAmountPerMonth : AmountPerMonth[]= [];

      for (let j = 0; j < target[i].amountsMonth.length; j++)
        addedAmountPerMonth.push({
          amount: target[i].amountsMonth[j].amount + source[i].amountsMonth[j].amount,
          units:  target[i].amountsMonth[j].units + source[i].amountsMonth[j].units,
          baseAmount: target[i].amountsMonth[j].baseAmount + source[i].amountsMonth[j].baseAmount});
      
      resultTable.push({
        year: target[i].year,
        amountsMonth: addedAmountPerMonth,
        total: ___sum(addedAmountPerMonth.map(am => am.amount))
      });
      
    }
  }
  else
    return source;

  return resultTable;
}

/**  
 * To aggregate properly, it's important both structures are of equal length.
 *  For example, if the first cost in b starts in May, b will be an array with only 8 records.
 *  If we now sum that with a, which can have the full 12 records we run into an issue when summing.
 *  This algorithm syncs both the months and years to be 2D square arrays of equal length and width. */
function _syncYears(a: AmountPerYear[], b: AmountPerYear[]) 
{
  const bSynced = ___map(a, item => _emptyFor(item.year));

  let bCounter = 0;

  for (let i = 0; i < a.length; i++) {
    if (bCounter >= b.length || a[i].year != b[bCounter].year)
      bSynced[i] = { year: a[i].year, amountsMonth: _emptyMonths(), total: 0 };
    else {
      bSynced[i] = b[bCounter];
      bCounter++;
    }
  }

  return bSynced;
}

/** Create a skeleton for a financial year row */
function _emptyFor(year: number): AmountPerYear {
  return {
    year, total: 0, amountsMonth: _emptyMonths()
  };
}

/** Create a skeleton for the financial year months within a year */
function _emptyMonths(): AmountPerMonth[] {
  return <AmountPerMonth[]> MONTHS.map(() => { return NULL_AMOUNT_PER_MONTH() });
}
