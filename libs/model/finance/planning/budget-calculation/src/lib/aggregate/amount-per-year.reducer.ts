import { map as ___map, sum as ___sum } from 'lodash';

import { MONTHS } from '@app/model/finance/planning/time';
import { AmountPerMonth, AmountPerYear } from "@app/model/finance/planning/budgets";
import { NULL_AMOUNT_PER_MONTH } from '@app/model/finance/planning/budget-defaults';

/** 
 * Algorithm that can merge two Budget Lines together by adding up their amounts.
 */
export class AmountPerYearReducer
{
  /** 
   * Merge two budget line amounts (Left merge, will copy over unaggregatable things from the leftmost occurence. ) 
   */
  public reduceAmounts(target: AmountPerYear[], source: AmountPerYear[]) : AmountPerYear[]
  {
    const resultTable: AmountPerYear[] = [];

    if (target)
    {
      if    (target.length > source.length) source = this._syncYears(target, source);
      else if (source.length > target.length) target = this._syncYears(source, target);

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

  // To aggregate properly, it's important both structures are of equal length.
  //  For example, if the first cost in b starts in May, b will be an array with only 8 records.
  //  If we now sum that with a, which can have the full 12 records we run into an issue when summing.
  //  This algorithm syncs both the months and years to be 2D square arrays of equal length and width.
  private _syncYears(a: AmountPerYear[], b: AmountPerYear[])
  {
    const bSynced = ___map(a, item => this._emptyFor(item.year));

    let bCounter = 0;

    for (let i = 0; i < a.length; i++) {
      if (bCounter >= b.length || a[i].year != b[bCounter].year)
        bSynced[i] = { year: a[i].year, amountsMonth: this._emptyMonths(), total: 0 };
      else {
        bSynced[i] = b[bCounter];
        bCounter++;
      }
    }

    return bSynced;
  }

  private _emptyFor(year: number): AmountPerYear {
    return {
      year, total: 0, amountsMonth: this._emptyMonths()
    };
  }

  private _emptyMonths(): AmountPerMonth[] {
    return <AmountPerMonth[]> MONTHS.map(m => { return NULL_AMOUNT_PER_MONTH });
  }
}
