import { HandlerTools } from '@iote/cqrs';

import { __DateFromStorage } from '@iote/time';

import { FunctionHandler, FunctionContext } from '@ngfi/functions';

import { ExpenseAllocs, Expenses, ExpensesAllocation } from '@app/model/finance/operations/expenses';
import { BudgetLine, BudgetLinesAllocation } from '@app/model/finance/planning/budgets';

import { AllocateExpensesService } from '../services/allocate-expenses.service';
import { AllocateBudgetLineService } from '../services/allocate-budget-line.service';

const BUDGET_LINES_EXP_ALLOCS = (orgId: string) => `orgs/${orgId}/exp-allocs`;

const BUDGET_LINES_REPO = (orgId: string) => `orgs/${orgId}/budget-lines`;
const BUDGET_LINES_ALLOCS_REPO = (orgId: string) => `orgs/${orgId}/budget-lines-allocs`;

const EXPENSES_REPO = (orgId: string) => `orgs/${orgId}/expenses`;
const EXPENSES_ALLOCS_REPO = (orgId: string) => `orgs/${orgId}/expenses-allocs`;

/**
 * @class AllocateBankPaymentsHandler.
 *
 * @description Creates a payment allocation for a given bank transaction.

 */
export class AllocateExpensesHandler extends FunctionHandler<{ orgId: string, expenseAlloc: ExpenseAllocs}, any>
{
  public async execute(data: { orgId: string, expenseAlloc: ExpenseAllocs}, context: FunctionContext, tools: HandlerTools) {
    tools.Logger.log(() => `[AllocateExpensesHandler].execute: allocating expense for: ${data.expenseAlloc.expenseId}`);

    //step 0. create alloc object
    const allocRepo =  tools.getRepository<ExpenseAllocs>(BUDGET_LINES_EXP_ALLOCS(data.orgId));
    const alloc = await allocRepo.create(data.expenseAlloc);

    tools.Logger.log(() => `[AllocateExpensesHandler].execute: alloc object is: ${alloc.id}`);

    if (!alloc) {
      tools.Logger.log(() => `[AllocateExpensesHandler].execute: alloc object is null`);
      throw new Error('alloc object is null');
    }

    data.expenseAlloc.id = alloc.id;

    // step 1. get the expense and budgetLine to allocate

    const budgetLinesRepo =  tools.getRepository<BudgetLine>(BUDGET_LINES_REPO(data.orgId));
    const budgetLine = await budgetLinesRepo.getDocumentById(data.expenseAlloc.budgetLineId);
    tools.Logger.log(() => `[AllocateExpensesHandler].execute: selected budgetLine: ${budgetLine.id}`);

    const expensesRepo =  tools.getRepository<Expenses>(EXPENSES_REPO(data.orgId));
    const expense = await expensesRepo.getDocumentById(data.expenseAlloc.expenseId);
    tools.Logger.log(() => `[AllocateExpensesHandler].execute: selected expense: ${expense.id}`);


    // step 2. create expense allocation
    tools.Logger.log(() => `[AllocateExpensesHandler].execute: starting expense allocation for: ${data.expenseAlloc.expenseId}`);

    const expenseAllocsRepo =  tools.getRepository<ExpensesAllocation>(EXPENSES_ALLOCS_REPO(data.orgId));
    const _expensesAllocsService = new AllocateExpensesService(tools.Logger);
    const expenseAlloc = _expensesAllocsService.createExpenseAllocation(expense, budgetLine, data.expenseAlloc);

    await expenseAllocsRepo.write(expenseAlloc, expenseAlloc.id!);

    // step 3. create budget-line allocation
    const _budgetLineAllocsService = new AllocateBudgetLineService(tools.Logger);

    const budgetLinesAllocsRepo =  tools.getRepository<BudgetLinesAllocation>(BUDGET_LINES_ALLOCS_REPO(data.orgId));
    const budgetLineAlloc = _budgetLineAllocsService.createBudgetLineAllocation(expense, budgetLine, data.expenseAlloc);

    await budgetLinesAllocsRepo.write(budgetLineAlloc, budgetLineAlloc.id!);

    return true;
  }
}