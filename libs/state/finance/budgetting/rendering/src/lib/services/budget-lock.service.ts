import { Injectable } from '@angular/core';

import { take } from 'rxjs';

import { IObject } from '@iote/bricks';
import { DataService, Repository, UserService } from '@ngfi/angular';

import { KuUser } from '@app/model/common/user';
import { Organisation } from '@app/model/organisation';
import { Budget } from '@app/model/finance/planning/budgets';

import { ActiveOrgStore } from '@app/state/organisation';

@Injectable({
  providedIn: 'root'
})
export class BudgetLockService {

  activeUserId: string;

  constructor(private _db: DataService,
              private _user$$: UserService<KuUser>,
              private _activeOrg$$: ActiveOrgStore
  ) 
  {
    this._user$$.getUserId().pipe(take(1)).subscribe((userId) => this.activeUserId = userId);
  }

  /**
   * Locks the budget from the component
   * Locks when the component is initialized and unlocks on destroy
   * @param budgetId 
   * @param lock 
   */
  lockBudget(budgetId: string, lock: boolean) {
    this._activeOrg$$.get().pipe(take(1)).subscribe((org) => {if (org) this.updateBudgetLock(org, budgetId, lock)});
  }

  /**
   * Simple repo fetch for the active budget lock document on the DB
   * @param org 
   * @param budgetId 
   * @param lock 
   * @returns A write operation for updating the lock document
   */
  updateBudgetLock(org: Organisation, budgetId: string, lock: boolean) {
    const repo = this._db.getRepo<BudgetLock>(`orgs/${org.id}/budgets/${budgetId}/config`);
    return repo.getDocumentById('budgetLock').pipe(take(1))
                                                .subscribe((budgetLock) => 
                                                    { if (budgetLock) this.saveLock(budgetLock, repo, lock)});
  }

  saveLock(bLock: BudgetLock, repo: Repository<BudgetLock>, lock: boolean) {
    if (!(bLock.isbudgetLocked && bLock.createdBy != this.activeUserId)) {
      bLock.isbudgetLocked = lock;
      bLock.createdBy = this.activeUserId;
      repo.write(bLock, bLock.id!);
    }
  }

  /**
   * When a budget is created this function creates the lock document
   * This ensures the budget lock query does not fail due to a null document
   * @param budget 
   */
  createBudgetLock(budget: Budget) {
    const repo = this._db.getRepo<BudgetLock>(`orgs/${budget.orgId}/budgets/${budget.id}/config`);
    const budgetLock: BudgetLock = {
      isbudgetLocked: false,
      createdBy: budget.createdBy
    }
    repo.write(budgetLock, 'budgetLock');
  }
}

interface BudgetLock extends IObject{
  isbudgetLocked: boolean;
}