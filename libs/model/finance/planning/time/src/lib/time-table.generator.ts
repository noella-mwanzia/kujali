import { MONTHS } from "./time.consts";

/**
 * Model class which can calculate a two-dimensional skeleton of years and months for a budget.
 */
export class TimeTableGenerator 
{

  /** Return two year dimensional skeleton of configured years and months 
   *    => [{year, [month, month, ...]}, ...] 
   */
  getTimeFrameSkeleton(startYear: number, durationInYears: number)
  {
    const years: any = [];
    for (let i = startYear; i < startYear + durationInYears; i++) {
      years.push({ year: i, months: MONTHS.map(month => month.month) });
    }
  
    return years;
  }
}
