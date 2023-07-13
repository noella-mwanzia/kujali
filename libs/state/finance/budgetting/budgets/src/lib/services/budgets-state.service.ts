import { Injectable } from '@angular/core';

import { Observable, map, switchMap, take, tap } from 'rxjs';

import { DataService } from '@ngfi/angular';

import { Budget, BudgetLine, BudgetLinesAllocation, BudgetStatus } from '@app/model/finance/planning/budgets';
import { TransactionPlan } from '@app/model/finance/planning/budget-items';

import { ActiveOrgStore } from '@app/state/organisation';

import { BudgetsStore } from '../stores/budgets.store';
import { BudgetLinesStore } from '../stores/budget-lines.store';
import { BudgetLinesAllocsStore } from '../stores/budget-lines-allocs.store';
import { ActiveBudgetStore } from '../stores/active-budget.store';

@Injectable({
  providedIn: 'root'
})
export class BudgetsStateService {

  constructor(private _dataService: DataService,
              private _activeOrg$$: ActiveOrgStore,
              private _budgets$$: BudgetsStore,
              private _activeBudget$$: ActiveBudgetStore,
              private _budgetLinesStore$$: BudgetLinesStore,
              private _budgetLinesAllocsStore$$: BudgetLinesAllocsStore
  ) { }

  getBudgetLine(): Observable<BudgetLine[]> {
    return this._budgetLinesStore$$.get();
  }

  getBudgetLineAllocs(): Observable<BudgetLinesAllocation[]> {
    return this._budgetLinesAllocsStore$$.get();
  }

  getBudgetLineById(id: string): Observable<BudgetLine> {
    return this._budgetLinesStore$$.get().pipe(map((budgetLines) => {return budgetLines.find((budgetLine) => budgetLine.id === id)!}));
  }

  getAllBudgets(): Observable<Budget[]> {
    return this._budgets$$.get();
  }

  getBudgetPlans(budgetId: string): Observable<TransactionPlan[]> {
    return this._activeOrg$$.get().pipe(switchMap((activeOrg) => this.getPlans$$(activeOrg.id!, budgetId)));
  }

  getPlans$$(orgId: string, budgetId: string): Observable<TransactionPlan[]> {
    const plansRepo = this._dataService.getRepo<TransactionPlan>(`orgs/${orgId}/budgets/${budgetId}/plans`);
    return plansRepo.getDocuments();
  }

  deActivateBudget(budget: Budget): Observable<Budget> {
    return this.getAllBudgets().pipe(take(1),
                                    map((activeBudgets) => activeBudgets.find((activeBudget) => activeBudget.id === budget.id)!),
                                    map((activeBudget) => {activeBudget.status = BudgetStatus.Open; return activeBudget}),
                                    switchMap((activeBudget) => this._budgets$$.update(activeBudget)));
  }
}
