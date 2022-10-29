import { Injectable } from "@angular/core";

import { clone as ___clone } from 'lodash';

/**
 * This service converts a backend data model representation of a calculated budget 
 *  into a budget which can be rendered by the frontend.
 * 
 * It scopes the 
 */
@Injectable()
export class TableForYearService
{

  /**
   * 
   * @param year 
   * @param rows 
   * @returns 
   */
  getTableForYear(year: number, rows: BudgetRowYears[])
  {
    return rows.map((row) => this._rowOfYear(year, row));
  }

  getTotalForYear(year: number, row: BudgetRowYears) {
    return this._rowOfYear(year, row); 
  }

  private _rowOfYear(year: Number, row: BudgetRowYears): BudgetRowMonths {
    const newRow = <any> ___clone(row);

    const forYear = row.amountsYear.find(aY => aY.year == year);

    if (forYear) {
      newRow.amountsMonth = forYear.amountsMonth;
      newRow.total = forYear.total;
    
      delete newRow.amountsYear;
    }
    else { // If not yet this year.
      newRow.amountsMonth = NULL_AMOUNT_MONTHS;
      newRow.total = 0;
    }
    return newRow;
  }

}
