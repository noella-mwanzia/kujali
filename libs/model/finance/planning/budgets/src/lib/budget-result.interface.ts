import { IObject } from "@iote/bricks";
import { BudgetRowMonths } from "./budget-row-months.interface";

export interface BudgetResult extends IObject
{
  id?: string;
  name: string;

  budgetId: string;

  costTotals: BudgetRowMonths;
  incomeTotals: BudgetRowMonths;

  childResults: BudgetRowMonths[];

  result: BudgetRowMonths;
  balance: BudgetRowMonths;

  createdOn: Date;
  updatedOn?: Date;
  createdBy: string;

  version: number;
}
