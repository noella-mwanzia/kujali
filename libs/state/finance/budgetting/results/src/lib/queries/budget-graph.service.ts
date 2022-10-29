 import { Injectable } from "@angular/core";
import * as _ from "lodash";

import { BudgetRowYears } from "../model/budget-row-years.interface";
import { BudgetResult, AmountPerYear, MONTHS } from '@elewa/portal-shared';

const COLOR_RANGES = ['#7986cb', '#3f51b5', '#666ad1', '#001970', '#536dfe', '#26c6da', '#0097a7'];

@Injectable()
export class BudgetGraphService
{
  constructor() {}

  createGraphBalanceLine(balance: BudgetRowYears) { return this._flatMapAmountsPerYear(balance.amountsYear); }
 
  createGraphValueBlocks(budgetHeader: BudgetResult) 
  {
    return [
      this._toGraphBlock(budgetHeader.result, 0),
      this._toGraphBlock(budgetHeader.costTotals, 1, true),
      this._toGraphBlock(budgetHeader.incomeTotals, 2)
    ]
    .concat(budgetHeader.childResults.map((chr, i2) => this._toGraphBlock(chr, 3 + i2, false, true)));
  }

  createLabels(timeSkeleton: AmountPerYear[]): string[]
  {
    const labels = [];
    for (let year of timeSkeleton)
    {
      labels.push(year.year + ' - jan');
      for (var i = 1; i < year.amountsMonth.length; i++)
        labels.push(MONTHS[i].slug);
    }

    return labels;
  }

  private _toGraphBlock(row: BudgetRowYears, i: number, absolute?: boolean, hidden?: boolean)
  {  
    return {
      label: row.name,
      data: this._flatMapAmountsPerYear(row.amountsYear, absolute),
      backgroundColor: this._chooseBackgroundColor(row.type, i),
      borderColor: this._chooseBorderColor(row.type),
      hidden: hidden
    };
  }

  // Region: Chart Data

  private _flatMapAmountsPerYear(amounts: AmountPerYear[], absolute?: boolean)
  {
    return _(amounts)                         // Enable to show values like cost positively.
              .map(year => year.amountsMonth.map(a => absolute ? Math.abs(a.amount) : a.amount))
              .reduce((prev, curr) => prev.concat(curr));
  }

  // Region: Color
  
  private _chooseBackgroundColor(type: string, index: number)
  {
    switch (type) {
      case 'incomeTotal': return 'rgba(81,150,87, 0.5)';
      case 'costTotal': return 'rgba(175,68,72, 0.5)';
      case 'result': return 'rgba(34,134,195, 0.5)';
      default:
        return this._selectColor(index);
    }
  }

  private _chooseBorderColor(type: string) {
    switch (type) {
      case 'incomeTotal': return '#519657';
      case 'costTotal': return '#af4448';
      case 'result': return '#2286c3';
      default:
        return 'gray';
    }
  }
  
  private _selectColor(i) {
    return COLOR_RANGES[i % COLOR_RANGES.length];
  }

}