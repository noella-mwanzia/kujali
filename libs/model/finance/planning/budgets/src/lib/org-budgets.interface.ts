import { Budget } from "./budget.interface";
import { BudgetStatus } from "./types/budget-status.enum";

/**
 * Hierarchical representation of all budgets (a user has access too) that are associated to the organisation.
 * Used in the budget overview screen to visualise budget structure.
 */
export interface OrgBudgetsOverview
{
  inUse: BudgetRecord[];

  underConstruction: BudgetRecord[];

  archived: BudgetRecord[]; 
}

/** 
 * Row in the hierarchical representation of the budget.
 * Represents an tree pattern.
 */
export interface BudgetRecord 
{
  budget: Budget;

  children: BudgetRecord[];

  status: BudgetStatus;

  lockedIn: boolean;
}
