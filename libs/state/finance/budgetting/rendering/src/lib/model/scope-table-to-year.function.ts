import { clone as ___clone } from 'lodash';

import { BudgetRowYear } from '@app/model/finance/planning/budget-lines-by-year';
import { AmountPerYear, BudgetRow } from "@app/model/finance/planning/budget-lines";

import { FinancialExplorerState } from "./f-explorer.state.model";

/**
 * Scopes a RenderedBudget to a financial year.
 * 
 * @param state - The RenderedBudget to scope
 * @param year  - The year to scope too
 */
export function __ScopeStateToYear(state: FinancialExplorerState)
{
  const year = state.year;

  state.scopedCosts        = state.budget.costs.map(c => _scopeLine(year, c));
  state.scopedCostTotals   = _scopeLine(year, state.budget.costTotals);
  state.scopedIncome       = state.budget.income.map(c => _scopeLine(year, c));
  state.scopedIncomeTotals = _scopeLine(year, state.budget.incomeTotals);
  state.scopedChildBudgets = state.budget.children.map(c => _scopeLine(year, c.header));
  state.scopedResult       = _scopeLine(year, state.budget.result);
  state.scopedBalance      = _scopeLine(year, state.budget.balance);

  return state;
}

/** Scope a signle line */
function _scopeLine(year: number, row: BudgetRow) 
{
  const yearBudget = _findYear(year, row.amountsYear);

  const line = ___clone(row) as BudgetRowYear;
  line.amountsMonth = yearBudget.amountsMonth;
  line.year = year;
  line.totalYear = yearBudget.total;

  return line;
}

const _findYear = (year: number, allYears: AmountPerYear[]) => allYears.find(y => y.year === year) as AmountPerYear;