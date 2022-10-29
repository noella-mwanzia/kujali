import { sum as ___sum, flatMap as ___flatmap } from 'lodash';

import { Budget } from "@app/model/finance/planning/budgets";
import { BudgetHeader, BudgetRow } from '@app/model/finance/planning/budget-lines';
import { NULL_AMOUNT_BY_YEAR_AND_MONTH } from "@app/model/finance/planning/budget-defaults";

import { BudgetGroup } from "@app/model/finance/planning/budget-rendering";

/**
 * Flattens a BudgetGroup into a list of BudgetRows, together forming the budget-table.
 * 
 * @param record - A root or leaf of the BudgetGroup aggregator. 
 * @param budget - The budget to construct/calculate.
 * @returns 
 */
export function __RenderLinesGroup(record: BudgetGroup | BudgetRow, budget: Budget): BudgetRow[]
{   
  if (record.isGroup)
  {
    const castGroup = <BudgetGroup> record;

    const childRows = ___flatmap(castGroup.children, record => __RenderLinesGroup(record, budget)); 

    return (record.type == 'costTotal' || record.type == 'incomeTotal')
              ? childRows // Income or Cost Totals are already captured in seperate headers.
              : [__RecordToHeader(castGroup, budget)].concat(childRows);
  }

  return [_recordToRow(<BudgetRow> record, budget)];
}

/**
 * Converts a BudgetGroup into a Header row
 * 
 * @param record - The BudgetGroup to turn into a row
 * @param budget - The budget to construct
 * 
 * @returns - The BudgetGroup aggregate row
 */
export function __RecordToHeader(record: BudgetGroup, budget: Budget): BudgetHeader
{
  const rc = _recordToRow(record, budget);
  rc.isHeader = true;

  return rc;
}

/**
 * Converts a budget row leave into a budget row
 * 
 * @param record - The BudgetRow to turn into a row
 * @param budget - The budget to construct
 * 
 * @returns - The BudgetRow row
 */
function _recordToRow(record: BudgetRow, budget: Budget): BudgetRow
{
  const aYs = record.amountsYear ? record.amountsYear : NULL_AMOUNT_BY_YEAR_AND_MONTH(budget.startYear, budget.duration);

  return {
    name: record.name,
    type: record.type,
    amountsYear: aYs,
    total: ___sum(aYs.map(aY => aY.total)),

    isHeader: false
  }
}