import { Injectable } from "@angular/core";
import { DataService } from "@ngfi/angular";

import { Observable, switchMap } from "rxjs";

import { IObject } from "@iote/bricks";

import { Organisation } from "@app/model/organisation";

import { ActiveOrgStore } from "@app/state/organisation";

/**
 * This service is responsible for checking if the budget is available for editing
 * 
 */
@Injectable()
export class BudgetLockQuery
{
  constructor(private _db: DataService,
              private _activeOrg: ActiveOrgStore
  ) { }

  /**
   * Gets the budget lock status.
   * 
   * @param {BudgetId} budget - The budget to render
   * @returns {boolean}
   */
  getLockStatus(budgetId: string): Observable<BudgetLock>
  {
    return this._activeOrg.get().pipe(switchMap((org) => this.getLockRepo(org, budgetId)));
  }

  getLockRepo(org: Organisation, budgetId: string) {
    const repo = this._db.getRepo<BudgetLock>(`orgs/${org.id}/budgets/${budgetId}/config`);
    return repo.getDocumentById('budgetLock');
  }
}

interface BudgetLock extends IObject{
  isbudgetLocked: boolean;
}
