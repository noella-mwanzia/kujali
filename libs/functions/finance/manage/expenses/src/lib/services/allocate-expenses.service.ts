
import { Logger } from '@iote/cqrs';
import { __DateToStorage } from '@iote/time';

import * as moment from 'moment';

import { BudgetLine } from '@app/model/finance/planning/budgets';
import { ExpenseAllocs, Expenses, ExpensesAllocation, ExpensesAllocationElement } from '@app/model/finance/operations/expenses';
import { AllocateWithType } from '@app/model/finance/allocations';

export class AllocateExpensesService {

  constructor(private _logger: Logger) { }

  createExpenseAllocation(expense: Expenses, budgetLine: BudgetLine, expenseAlloc: ExpenseAllocs): ExpensesAllocation {

    this._logger.log(() => `[AllocateExpensesService].createExpenseAllocation: creating expense allocation for: ${expense.id}`);
    this._logger.log(() => `[AllocateExpensesService].createExpenseAllocation: budgetLine :  ${budgetLine.id}`);

    let expenseElements: ExpensesAllocationElement[] = this.createExpenseAllocationElement(expense, budgetLine, expenseAlloc);

    const allocStatus = this.calculateAllocatedAmount(expense, budgetLine, expenseAlloc);

    let expenseAllocation: ExpensesAllocation = {
      id: expense.id!,
      elements: expenseElements,
      allocStatus: allocStatus.status,
      allocId: expenseAlloc.id! ?? '',
      to: budgetLine.id!,
      amount: expenseAlloc.amount,
    }
    
    allocStatus.alloc?.balance ? expenseAllocation.balance = allocStatus.alloc.balance : null;
    allocStatus.alloc?.credit ? expenseAllocation.credit = allocStatus.alloc.credit : null;

    return expenseAllocation;
  }

  createExpenseAllocationElement(expense: Expenses, budgetLine: BudgetLine, allocs: ExpenseAllocs): ExpensesAllocationElement[] {
    this._logger.log(() => `[AllocateExpensesService].createExpenseAllocationElement for:  ${expense.id} and ${budgetLine.id}`);

    let expenseAllocationElement: ExpensesAllocationElement = {
      withId: budgetLine.id!,
      allocAmount: allocs.amount ?? 0,
      allocMode: 1,
      withType: AllocateWithType.BudgetLine,
      allocDate: __DateToStorage(moment()),
    }

    return [expenseAllocationElement];
  }

  calculateAllocatedAmount(expense: Expenses, budgetLine: BudgetLine, alloc: ExpenseAllocs) {
    this._logger.log(() => `[AllocateExpensesService].calculateAllocatedAmount for expense amount:  ${expense.amount} and ${budgetLine.id} budgetLine`);

    let totalAllocatedAmount = alloc.amount ?? 0;

    if (totalAllocatedAmount > Math.abs(budgetLine.amount)) {
      return {status: 5, alloc : {credit: totalAllocatedAmount - Math.abs(budgetLine.amount)}}
    } else if (totalAllocatedAmount < Math.abs(budgetLine.amount)) {
      return {status: 5, alloc : {balance: Math.abs(budgetLine.amount) - totalAllocatedAmount}}
    } else {
      return {status: 1};
    }
  }
}
