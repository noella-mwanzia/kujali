import { BudgetRow } from "@app/model/finance/planning/budget-lines";
import { BudgetLineConfiguration } from "./planned-transaction-stub.interface";

import { TransactionOccurence } from "@app/model/finance/planning/budget-items";


/**
 * Entry in the budget. 
 * 
 * Specific cost or income within category with time-mapped occurences within x years plan.
 * This is a technical helper object solely used for calculation and visualization and does not get stored in the database.
 * 
 * When a budget is approved (read saved), on saving a slimmed down version of this is stored with 
 *  key information. See @{BudgetLine} to understand that type.
 */
export interface BudgetLineRow extends BudgetRow 
{
  categoryId: string;
  config: BudgetLineConfiguration;

  plans: TransactionOccurence[];
}
