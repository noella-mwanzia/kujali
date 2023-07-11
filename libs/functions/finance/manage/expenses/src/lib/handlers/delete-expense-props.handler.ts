import { HandlerTools } from '@iote/cqrs';

import { __DateFromStorage } from '@iote/time';

import { FunctionHandler, FunctionContext } from '@ngfi/functions';

import { ExpenseAllocs, Expenses, ExpensesAllocation } from '@app/model/finance/operations/expenses';
import { BudgetLinesAllocation } from '@app/model/finance/planning/budgets';

import { Query } from '@ngfi/firestore-qbuilder';

const BUDGET_LINES_EXP_ALLOCS = (orgId: string) => `orgs/${orgId}/exp-allocs`;
const EXPENSES_ALLOCS_REPO = (orgId: string) => `orgs/${orgId}/expenses-allocs`;
const BUDGET_LINES_ALLOCS_REPO = (orgId: string) => `orgs/${orgId}/budget-lines-allocs`;

/**
 * @class DeleteExpenseProps.
 *
 * @description Creates a payment allocation for a given bank transaction.

 */
export class DeleteExpenseProps extends FunctionHandler<{ orgId: string, expense: Expenses}, boolean>
{
  public async execute(data: { orgId: string, expense: Expenses}, context: FunctionContext, tools: HandlerTools): Promise<boolean> {
    tools.Logger.log(() => `[DeleteExpenseProps].execute: deleting expense props for: ${data.expense.id}`);

    // step 1 Get all the allocations for this expense
    const expAandBudgetsAllocsRepo =  tools.getRepository<ExpenseAllocs>(BUDGET_LINES_EXP_ALLOCS(data.orgId));
    const allocs = await expAandBudgetsAllocsRepo.getDocuments(new Query().where('expenseId', '==', data.expense.id));

    const budgetLineIds = allocs.map(a => a.budgetLineId);

    //step 2. find all the exp allocations and budgetLine allocs for this expense
    const budgetLinesAllocsRepo =  tools.getRepository<BudgetLinesAllocation>(BUDGET_LINES_ALLOCS_REPO(data.orgId));
    const expAllocsRepo = tools.getRepository<ExpensesAllocation>(EXPENSES_ALLOCS_REPO(data.orgId));

    // step 3 delete all the exp allocations and budgetLine allocs for this expense
    const budgetLineAllocs = await budgetLinesAllocsRepo.getDocuments(new Query().where('id', 'in' , budgetLineIds));
    const expAlloc = await expAllocsRepo.getDocumentById(data.expense.id!);

    if (budgetLineAllocs.length > 0) {
      const deleteBudgetLine$ = budgetLineAllocs.map(async (alloc) => {
        if (alloc.elements.length > 1) {
          const popAmount = alloc.elements.filter(e => e.withId === data.expense.id).reduce((acc, e) => acc + e.allocAmount, 0);
          alloc.elements = alloc.elements.filter(e => e.withId !== data.expense.id);

          if (alloc?.balance)
            alloc.balance = alloc.balance + popAmount;

          if (alloc?.credit)
            alloc.credit = alloc.credit + popAmount;
          
          await budgetLinesAllocsRepo.update(alloc);
          return
        }
        await budgetLinesAllocsRepo.delete(alloc.id!);
      });

      await Promise.all(deleteBudgetLine$);
    }

    await expAllocsRepo.delete(expAlloc.id!);

    // step 4 delete allocs objects
    const deleteAllocs$ = allocs.map(async (alloc) => {
      await expAandBudgetsAllocsRepo.delete(alloc.id!);
    });

    await Promise.all(deleteAllocs$);
    
    return true;
  }
}