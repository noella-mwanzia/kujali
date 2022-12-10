import { BudgetRowType } from "@app/model/finance/planning/budget-grouping";

import { TransactionPlan } from "../transaction-occurence.interface";

/** Expected input of the transaction planner module */
export interface PlanTrInput 
{
  lineId?: string;

  budgetId?: string;
  /** Month in which the modal was opened. */
  fromMonth: number;

  /** Master type to plan a transaction for */
  type: BudgetRowType.IncomeLine | BudgetRowType.CostLine;

  isInCreateMode: boolean;

  occurence?: TransactionPlan;
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

export interface CellInput {
  amountsMonth: {
    plan: TransactionPlan;
  };
  amountsYear: [];
  isHeader: boolean;
  name: string;
  total: number;
  totalYear: number;
  type: number;
  year: number;
}

export interface Month {
  name: string;
  slug: string;
  month: number
}