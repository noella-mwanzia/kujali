import { BudgetRowType } from "@app/model/finance/planning/budget-grouping";

import { TransactionPlan } from "../transaction-occurence.interface";

/** Expected input of the transaction planner module */
export interface PlanTrInput 
{
  lineId?: string;
  /** Month in which the modal was opened. */
  month: number;

  /** Master type to plan a transaction for */
  type: BudgetRowType.IncomeLine | BudgetRowType.CostLine;
}

/** Expected input of the transaction planner module, enhanced by state */
export interface LoadedPlanTrInput extends PlanTrInput
{
  /** Year for which the modal was opened. */
  year: number;
  
  /** Previous transaction on the line */
  tr?: TransactionPlan;
  trMode: 'create' | 'edit';
}