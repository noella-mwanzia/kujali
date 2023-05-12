import { IObject } from "@iote/bricks";

export interface ExpenseAllocs extends IObject {
  // The amount of the expense.
  amount: number;

  // The budgetLineId that this expense belongs to.
  budgetLineId: string;

  // The expenseId that this expense belongs to.
  expenseId: string;
}