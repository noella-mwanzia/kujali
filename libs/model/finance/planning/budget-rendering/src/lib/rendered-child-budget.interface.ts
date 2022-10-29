import { BudgetRow } from "@app/model/finance/planning/budget-lines";


/** Wrapper around the result line of a rendered child for display and calculation purposes during rendering. */
export interface RenderedChildBudget 
{
  /** Name of the child budget */
  name: string;
  /** ID of the child budget */
  id: string;
  /** Result header of the child budget */
  header: BudgetRow;
}