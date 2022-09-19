import { IObject } from "@iote/bricks";
import { BudgetRow } from "@kujali/finance/planning/budgets";

import { PlannedTransactionStub } from "./planned-transaction-stub.interface";

/**
 * Entry in the budget. 
 * 
 * Specific cost or income within category with time-mapped occurences within x years plan.
 */
export interface BudgetLine extends BudgetRow, IObject 
{
  categoryId: string;
  transaction: PlannedTransactionStub;
}
