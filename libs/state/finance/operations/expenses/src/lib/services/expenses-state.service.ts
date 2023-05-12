import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Observable, map, switchMap, tap } from 'rxjs';
import * as moment from 'moment';

import { __DateFromStorage, __DateToStorage } from '@iote/time';

import { ExpenseAllocs, Expenses } from '@app/model/finance/operations/expenses';

import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { ActiveOrgStore } from '@app/state/organisation';

import { ExpensesStore } from '../stores/expenses.store';
import { ExpensesAllocsStore } from '../stores/expenses-allocs.store';

@Injectable({
  providedIn: 'root'
})
export class ExpensesStateService {

  constructor(private _aFF: AngularFireFunctions,
              private _activeOrg$$: ActiveOrgStore,
              private _expenses$$: ExpensesStore,
              private _expensesAllocs$$: ExpensesAllocsStore
  ) { }

  getAllExpenses(): Observable<Expenses[]> {
    return this._expenses$$.get();
  }

  getAllExpensesAllocs(): Observable<ExpenseAllocs[]> {
    return this._expensesAllocs$$.get();
  }

  createExpense(expense: FormGroup) {
    const expenseObject = this.createExpenseObject(expense.value);
    return this._expenses$$.add(expenseObject).pipe(switchMap((exp) => this.allocateExpense(exp)));
  }

  allocateExpense(expense: Expenses) {
    return this._activeOrg$$.get().pipe(
      map((org) => this.createExpBudgetLineAllocation(org.id!, expense)),
      switchMap((data) => this._aFF.httpsCallable('allocateExpenses')(data)));
  }

  createExpBudgetLineAllocation(orgId: string, expense: Expenses) {
    const month = __DateFromStorage(expense.date).month();
    const year = __DateFromStorage(expense.date).year();

    const lineId = `${year}-${month}-${expense.lineId}`;

    const alloc: ExpenseAllocs = {
      amount: expense.amount,
      budgetLineId: lineId,
      expenseId: expense.id!,
    }
    return {orgId: orgId, expenseAlloc: alloc};
  }

  createExpenseObject(expense): Expenses {
    return {
      amount: expense.amount,
      budgetId: expense.budget.id,
      planId: expense.plan.id,
      lineId: expense.plan.lineId,
      date: __DateToStorage(moment(expense.date)),
      vat: expense.vat,
      trCat: expense.category.id,
      trType: expense.type.id,
      note: expense.note,
    }
  }
}
