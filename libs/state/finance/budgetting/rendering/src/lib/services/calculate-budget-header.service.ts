import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { ___CalculateLocalBudget, ___PlannedTransactionsToBudgetLines, ___RenderBudget } from '@app/model/finance/planning/budget-calculation';
import { TransactionPlan } from '@app/model/finance/planning/budget-items';

import { AmountPerYear, BudgetHeaderResult } from '@app/model/finance/planning/budget-lines';
import { RenderedBudget } from '@app/model/finance/planning/budget-rendering';
import { Budget } from '@app/model/finance/planning/budgets';

import { BudgetHeaderResultStore } from '@app/state/finance/budgetting/budgets';

import { BackendService } from 'libs/util/ngfi/angular/src/lib';

@Injectable({
  providedIn: 'root'
})
export class CalculateBudgetHeaderService {

  constructor(private _bs: AngularFireFunctions,
              private budgetHeaders$$: BudgetHeaderResultStore
  ) 
  { }

  _bdgtCalculateHeader(budget: Budget, plans: TransactionPlan[]) {
    let budgetData = {budget: budget, plans: plans};
    return this._bs.httpsCallable('bdgtCalculateHeaderOnSaveBudget')(budgetData);
  }
}
