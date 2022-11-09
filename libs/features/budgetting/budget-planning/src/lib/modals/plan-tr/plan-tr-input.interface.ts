import { BudgetRowType } from "@app/model/finance/planning/budget-grouping";
import { TransactionPlan } from "@app/model/finance/planning/budget-items";

/** Expected input of the transaction planner module */
export interface PlanTrInput 
{
  /** Master type to plan a transaction for */
  type: BudgetRowType.IncomeLine | BudgetRowType.CostLine;
  
  /** Previous transaction on the line */
  tr?: TransactionPlan;
}