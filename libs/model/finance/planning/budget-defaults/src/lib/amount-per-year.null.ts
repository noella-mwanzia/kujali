import { TimeTableGenerator } from "@app/model/finance/planning/time";
import { AmountPerYear } from "@app/model/finance/planning/budget-lines";

import { NULL_AMOUNT_PER_MONTH } from "./amount-per-month.null";

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
              .map((y: any) => ({ 
                year: y.year,
                amountsMonth: y.months.map(() => NULL_AMOUNT_PER_MONTH()),
                total: 0
              }));
}