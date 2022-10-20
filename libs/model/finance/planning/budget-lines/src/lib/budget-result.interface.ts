import { IObject } from "@iote/bricks";
import { BudgetRow } from "./budget-row.interface";

/**
 * Budget result section.
 * 
 * Aggregate of the key amount header-rows (by month over the whole period of the budget) of the budget such as
 *    - cost total
 *    - income total
 * Together with the results of the child budgets
 * 
 * The sum of both combined is this result.
 */
export interface BudgetResult extends IObject
{
  /** Name of the budget */
  name: string;

  /** Org ID */
  orgId: string;
  /** Budget ID */
  budgetId: string;

  /** Cost Total Row - Total cost by month */
  costTotals: BudgetRow;
  /** Income Total Row - Total income by month */
  incomeTotals: BudgetRow;

  /** Child results row. Result of child budgets line by line */
  childResults: BudgetRow[];

  /** Result line of this budget (SUM COST, INCOME, SUM(...RESULTS)) */
  result: BudgetRow;

  /** Balance - Cashflow forecasting */
  balance: BudgetRow;

  /** Versioning. Results are never overwritten. */
  version: number;
}
