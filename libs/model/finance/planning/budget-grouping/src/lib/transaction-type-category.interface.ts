import { IObject } from "@iote/bricks";

import { BudgetRowType } from "./budget-row-type.enum";

/**
 * Second-highest level grouping (right under cost or income) of a budget grouping.
 * 
 * - Grouped into a budget category section in the budget explorer
 */
export interface TransactionTypeCategory extends IObject 
{
  /** Group name */
  name: string;
  /** Budget Row Type - Are these costs or income streams? */
  type: BudgetRowType.CostLine | BudgetRowType.IncomeLine;
  /** Group order of appearance. */
  order: number;
}