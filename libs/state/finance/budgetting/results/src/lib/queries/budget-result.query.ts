import { Injectable } from "@angular/core";

import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { SubSink } from 'subsink';

import { DataService } from "@ngfi/angular";
import { Query } from "@ngfi/firestore-qbuilder";

import { BudgetResult } from "@app/model/finance/planning/budget-lines";
import { NULL_BUDGET_RESULT_MONTH } from '@app/model/finance/planning/budget-defaults';

import { ActiveOrgStore } from "@app/state/organisation";
import { Budget } from "@app/model/finance/planning/budgets";

/**
 * The budget-result header determines the result and balance of a budget.
 *  This is crucial information as it's used by both own as parent budgets to aggregate and visualize results.
 */
@Injectable()
export class BudgetResultQuery
{
  private _sbS = new SubSink();

  private _activeOrg!: string;

  constructor(org$$: ActiveOrgStore,
              private _db: DataService)
  { 
    this._sbS.sink = 
      org$$.get()
        .subscribe(o => this._activeOrg = o.id as string);
  }

  /**
   * @arg {Budget} - The budget for which to get the result calculation.
   * @returns {BudgetResult} The budget-result header which determines the result and balance of a budget.
   *                         Used by both own as parent budgets to aggregate and visualize results.
   */
  getBudgetResult(budget: Budget): Observable<BudgetResult>
  {
    return this._db.getRepo<BudgetResult>(`orgs/${this._activeOrg}/budgets/${budget.id}/header`)
               .getDocuments(new Query().max('version'))
               .pipe(map(bs => bs ? bs[0]
                                  : NULL_BUDGET_RESULT_MONTH(this._activeOrg, budget.id as string, budget.startYear, budget.duration)));
  }
}
