import { BudgetLine, BudgetLinesAllocation } from "@app/model/finance/planning/budgets";

export interface BudgetLineAllocUI extends BudgetLine, BudgetLinesAllocation {}

export interface BudgetLineUI {
  amount: number;
  baseAmount: number;
  budgetName: string;
  lineName: string;
  aloocationName?: string;
}