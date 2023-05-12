import { Injectable } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';

import { combineLatest } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { Store } from '@iote/state';

import { Budget } from '@app/model/finance/planning/budgets';

import { BudgetsStore } from './budgets.store';

@Injectable()
export class ActiveBudgetStore extends Store<Budget>
{
  protected store = 'active-budget-store';
  _activeBudget: string;

  constructor(_budgetsStore$$: BudgetsStore,
              _router: Router
  ) {
    super(null as any);

    const budgets$ = _budgetsStore$$.get();
    const route$ = _router.events.pipe(filter((ev: Event) => ev instanceof NavigationEnd), map(ev => ev as NavigationEnd));

    this._sbS.sink = combineLatest([budgets$, route$])
      .subscribe(([budgets, route]) => {
        const budgetId = this._getRoute(route);

        if (budgetId !== '__noop__') {
          const budget = budgets.find(j => j.id === budgetId);

          if (budget) {
            this._activeBudget = budget.id as string;
            this.set(budget, 'UPDATE - FROM DB || ROUTE');
          }
        }

      });
  }

  private _getRoute(route: NavigationEnd): string {
    const elements = route.url.split('/');
    const budgetId = elements.length >= 3 ? elements[2] : '__noop__';
    return budgetId;
  }

}