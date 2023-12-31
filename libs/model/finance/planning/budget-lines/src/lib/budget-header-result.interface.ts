import { IObject } from "@iote/bricks";

export interface BudgetHeaderResult extends IObject
{
  id: string;

  orgId: string;

  /** Name of the budget */
  name: string;

  /** Budget ID */
  budgetId: string;

  /** Budget Start Year */
  startY: number;

  /** Budget Duration */
  duration: number;

  years: number[];

  /** Scoped results values month over month */
  headers: {};
}
