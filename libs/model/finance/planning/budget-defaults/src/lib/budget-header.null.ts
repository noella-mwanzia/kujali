
import { BudgetRow, BudgetRowType } from "@app/model/finance/planning/budget-lines";
import { NULL_AMOUNT_BY_YEAR_AND_MONTH } from "./amount-per-year.null";

/**
 * Default Table header. Set on initialisation of a budget. 
 * 
 * @param name      - Name of the header row.
 * @param type      - Type of the header row.
 * @param startYear - Year in which to start.
 * @param duration  - Number of years to generate.
 * @returns A populated table header.
 */
export function NULL_BUDGET_HEADER(name: string, type: BudgetRowType, startYear: number, duration: number): BudgetRow
{
  return {
    isHeader: true,
    amountsYear: NULL_AMOUNT_BY_YEAR_AND_MONTH(startYear, duration),
    total: 0,

    name, type
  };
}
