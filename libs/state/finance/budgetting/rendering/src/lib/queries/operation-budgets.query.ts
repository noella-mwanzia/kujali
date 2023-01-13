import { Injectable } from "@angular/core";

import { catchError, Observable, throwError } from "rxjs";

import { DataService } from "@ngfi/angular";

import { Budget } from "@app/model/finance/planning/budgets";
import { TransactionPlan } from "@app/model/finance/planning/budget-items";

/**
 * This service is responsible for rendering budgets by counting up their 
 *  internal lines with their results.
 * 
 * @note This service is used for single use on page load of the budget explorer.
 * @note Should only be imported by BudgetExplorerQuery!
 */
@Injectable()
export class OperationBudgetsQuery
{
  constructor(private _db: DataService) { }

  /**
   * Gets all the budget lines beloning to a budget.
   * 
   * @param {Budget} budget - The budget to render
   * @returns {RenderedBudget}
   */
  getLines(orgId: string): Observable<any[]>
  {
    const linesRepo = this._db.getRepo<TransactionPlan>(`orgs/${orgId}/expenses/config/lines`);
    return linesRepo.getDocuments();
  }

  getYearMonths(orgId: string, yearId: string): Observable<any> {
    const yearsRepo = this._db.getRepo<TransactionPlan>(`orgs/${orgId}/expenses/config/years/${yearId}/months`);
    return yearsRepo.getDocuments();
  }

  getLineMonths(orgId: string, lineId: string, yearIndex: string): Observable<TransactionPlan[]> {
    const yearsRepo = this._db.getRepo<TransactionPlan>(`orgs/${orgId}/expenses/config/lines/${lineId}/years/${yearIndex}/months`);
    return yearsRepo.getDocuments();
  }


}
