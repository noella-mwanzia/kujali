import { Injectable } from '@angular/core';

import { AmountPerYear, BudgetHeaderResult } from '@app/model/finance/planning/budget-lines';

import { BudgetHeaderResultStore } from '@app/state/finance/budgetting/budgets';

@Injectable({
  providedIn: 'root'
})
export class CalculateBudgetHeaderService {

  constructor(private budgetHeaders$$: BudgetHeaderResultStore) 
  { }

  _bdgtCalculateHeader(budgetId: string, budgetName: string, years: number[], values: AmountPerYear[]) {
    let header: BudgetHeaderResult  = {
      id: Math.floor(Date.now() / 1000).toString(),
      name: budgetName,
      budgetId: budgetId,
      startY: years[0],
      duration: years.length,
      headers: {}
    }
    
    values.forEach((yearValues) => {
      let year = yearValues.year;
      header.headers[year] = yearValues.amountsMonth.map((months) => months.amount);
    })
    
    this._saveBudgetHeaders(header);
  }

  _saveBudgetHeaders(headerValues: BudgetHeaderResult) {
    this.budgetHeaders$$.add(headerValues as BudgetHeaderResult, headerValues.id).subscribe();
  }
}
