import { Logger } from '@iote/cqrs';

import { ExpenseAllocs, Expenses } from '@app/model/finance/operations/expenses';
import { BudgetLine, BudgetLinesAllocation, BudgetLinesAllocationElement } from '@app/model/finance/planning/budgets';

export class AllocateBudgetLineService {

  constructor(private _logger: Logger) { }

  createBudgetLineAllocation(expense: Expenses, budgetLine: BudgetLine, expenseAlloc: ExpenseAllocs): BudgetLinesAllocation {

    this._logger.log(() => `[AllocateBudgetLineService].createBudgetLineAllocation: creating expense allocation for: ${expense.id}`);
    this._logger.log(() => `[AllocateBudgetLineService].createBudgetLineAllocation: budgetLine :  ${budgetLine.id}`);

    let budgetLineElements: BudgetLinesAllocationElement[] = this.createBudgetLineAllocationElement(expense, budgetLine, expenseAlloc);

    const allocStatus = this.calculateAllocatedAmount(expense, budgetLine, expenseAlloc);

    let budgetLineAllocation: BudgetLinesAllocation = {
      id: budgetLine.id!,
      elements: budgetLineElements,
      allocStatus: allocStatus.status,
      allocId: expenseAlloc.id! ?? '',
      amount: expenseAlloc.amount,
    }
    
    allocStatus.alloc?.balance ? budgetLineAllocation.balance = allocStatus.alloc.balance : null;
    allocStatus.alloc?.credit ? budgetLineAllocation.credit = allocStatus.alloc.credit : null;

    return budgetLineAllocation;
  }

  createBudgetLineAllocationElement(expense: Expenses, budgetLine: BudgetLine, allocs: ExpenseAllocs): BudgetLinesAllocationElement[] {
    this._logger.log(() => `[AllocateBudgetLineService].createBudgetLineAllocationElement for:  ${expense.id} and ${budgetLine.id}`);

    let budgetLineAllocationElement: BudgetLinesAllocationElement = {
      expenseId: expense.id!,
      allocAmount: allocs.amount ?? 0,
      allocMode: 1
    }

    return [budgetLineAllocationElement];
  }

  calculateAllocatedAmount(expense: Expenses, budgetLine: BudgetLine, alloc: ExpenseAllocs) {
    this._logger.log(() => `[AllocateBudgetLineService].calculateAllocatedAmount for expense amount:  ${expense.amount} and ${budgetLine.id} budgetLine`);

    let totalAllocatedAmount = alloc.amount ?? 0;

    if (totalAllocatedAmount > Math.abs(budgetLine.amount)) {
      return {status: 5, alloc : {credit: totalAllocatedAmount - Math.abs(budgetLine.amount) ?? -1}}
    } else if (totalAllocatedAmount < Math.abs(budgetLine.amount)) {
      return {status: 5, alloc : {balance: Math.abs(budgetLine.amount) - totalAllocatedAmount ?? -1}}
    } else {
      return {status: 1};
    }
  }
}
