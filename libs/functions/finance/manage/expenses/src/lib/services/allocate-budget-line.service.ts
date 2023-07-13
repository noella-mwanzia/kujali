import { Logger, Repository } from '@iote/cqrs';
import { __DateToStorage } from '@iote/time';

import * as moment from 'moment';

import { AllocateWithType } from '@app/model/finance/allocations';
import { ExpenseAllocs, Expenses } from '@app/model/finance/operations/expenses';
import { BudgetLine, BudgetLinesAllocation, BudgetLinesAllocationElement } from '@app/model/finance/planning/budgets';

export class AllocateBudgetLineService {

  constructor(private _logger: Logger) { }

  async createBudgetLineAllocation(expense: Expenses, budgetLine: BudgetLine, expenseAlloc: ExpenseAllocs, budgetLineAllocsRepo: Repository<BudgetLinesAllocation>): Promise<BudgetLinesAllocation> {

    this._logger.log(() => `[AllocateBudgetLineService].createBudgetLineAllocation: creating expense allocation for: ${expense.id}`);
    this._logger.log(() => `[AllocateBudgetLineService].createBudgetLineAllocation: budgetLine :  ${budgetLine.id}`);

    let budgetLineElements: BudgetLinesAllocationElement[] = this.createBudgetLineAllocationElement(expense, budgetLine, expenseAlloc);

    // check if an allocation already exists for the budgetLine
    const budgetLineAlloc: BudgetLinesAllocation = await budgetLineAllocsRepo.getDocumentById(budgetLine.id!);

    if (budgetLineAlloc) {
      this._logger.log(() => `[AllocateBudgetLineService].createBudgetLineAllocation: Found an existing budgetLine alloc :  ${budgetLineAlloc.id}`);

      const prevBudgetLineAllocElements = budgetLineAlloc.elements;
      const newBudgetLineAllocElements = budgetLineElements;

      const allocStatus = this.calculateAllocatedAmount(expense, budgetLine, expenseAlloc, true, budgetLineAlloc);

      budgetLineAlloc.allocStatus = allocStatus.status;

      // remove previous allocation status
      delete budgetLineAlloc.balance;
      delete budgetLineAlloc.credit;

      allocStatus.alloc?.balance ? budgetLineAlloc['balance'] = allocStatus.alloc.balance : null;

      const allElements = [...prevBudgetLineAllocElements, ...newBudgetLineAllocElements];
      budgetLineAlloc.elements = allElements;

      return budgetLineAlloc;
    }

    const allocStatus = this.calculateAllocatedAmount(expense, budgetLine, expenseAlloc, false);

    let budgetLineAllocation: BudgetLinesAllocation = {
      id: budgetLine.id!,
      elements: budgetLineElements,
      allocStatus: allocStatus.status,
      allocId: expenseAlloc.id! ?? '',
      amount: budgetLine.amount,
    }
    
    allocStatus.alloc?.balance ? budgetLineAllocation.balance = allocStatus.alloc.balance : null;
    allocStatus.alloc?.credit ? budgetLineAllocation.credit = allocStatus.alloc.credit : null;

    return budgetLineAllocation;
  }

  createBudgetLineAllocationElement(expense: Expenses, budgetLine: BudgetLine, allocs: ExpenseAllocs): BudgetLinesAllocationElement[] {
    this._logger.log(() => `[AllocateBudgetLineService].createBudgetLineAllocationElement for:  ${expense.id} and ${budgetLine.id}`);

    let budgetLineAllocationElement: BudgetLinesAllocationElement = {
      withId: expense.id!,
      allocAmount: allocs.amount ?? 0,
      allocDate: __DateToStorage(moment()),
      allocMode: -1,
      withType: AllocateWithType.Expense,
    }

    return [budgetLineAllocationElement];
  }

  calculateAllocatedAmount(expense: Expenses, budgetLine: BudgetLine, alloc: ExpenseAllocs, allocExists: boolean, budgetLineAlloc?: BudgetLinesAllocation) {
    this._logger.log(() => `[AllocateBudgetLineService].calculateAllocatedAmount for expense amount:  ${expense.amount} and ${budgetLine.id} budgetLine`);

    let totalAllocatedAmount = alloc.amount ?? 0;

    let budgetLineAmount = allocExists ? budgetLineAlloc?.balance! ? budgetLineAlloc?.balance! : budgetLineAlloc?.credit! : Math.abs(budgetLine.amount);

    if (totalAllocatedAmount > budgetLineAmount) {
      return {status: 5, alloc : {credit: totalAllocatedAmount - budgetLineAmount ?? -1}}
    } else if (totalAllocatedAmount < budgetLineAmount) {
      return {status: 5, alloc : {balance: budgetLineAmount - totalAllocatedAmount ?? -1}}
    } else {
      return {status: 1};
    }
  }
}
