import { AmountPerYear } from "@kujali/finance/planning/budgets";

import { NULL_AMOUNT_PER_MONTH } from "./amount-per-month.null";

import { TimeTableGenerator } from "../../time/time-table.generator";

/**
 * Default AmountPerYear. Set on initialisation of a budget. 
 * 
 * @param startYear - Year in which to start.
 * @param duration  - Number of years to generate.
 * 
 * @returns A populated AmountPerYear, representing a timetable for a single row over all years of the budget..
 */
export function NULL_AMOUNT_BY_YEAR_AND_MONTH(startYear: number, duration: number): AmountPerYear[]
{
  return new TimeTableGenerator()
              .getTimeFrameSkeleton(startYear, duration)
              .map(y => ({ 
                year: y.year,
                amountsMonth: y.months.map(m => NULL_AMOUNT_PER_MONTH),
                total: 0
              }));
}