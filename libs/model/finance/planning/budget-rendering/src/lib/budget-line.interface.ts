import { IObject } from "@iote/bricks";

import { BudgetRow } from "@app/model/finance/planning/budget-lines";
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
