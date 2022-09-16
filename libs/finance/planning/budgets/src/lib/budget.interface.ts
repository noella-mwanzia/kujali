import { IObject } from "@iote/bricks";
import { BudgetHeader } from "./budget-header.interface";

export interface Budget extends IObject {
  name: string;

  status: BudgetStatus;

  /** Latest balance - For updating purposes. */
  result: BudgetHeader;

  /** Override list can be compared to breadcrumbs, leading up to the earliest budget. Each level up with less priority.
   *    The later in the chain (the later in fact being this budget), the more it overrides the older. */
  overrideList: string[];
  overrideNameList: string[];

  childrenList: string[];

  startYear: number;
  /** [0..11] -> Index representing the month. */
  startMonth: number;
  /** Duration in months */
  duration: number;
}

export type BudgetStatus = 'in-use' | 'open' | 'archived' | 'deleted';