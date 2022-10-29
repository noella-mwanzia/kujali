import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, switchMap, take } from 'rxjs/operators';

import { KuUser } from '@app/model/common/user';
import { Organisation } from '@app/model/organisation';

import { Budget } from '@app/model/finance/planning/budgets';

import { UserStore } from '@app/state/user';
import { ActiveOrgStore } from '@app/state/organisation';
import { BudgetsStore }   from '@app/state/finance/budgetting/budgets';

import { BudgetRendererService } from './budget-renderer.service';

/** 
 * A query which can render budgets for the budget explorer and other potential pages.
 * 
 *  - Depends on budgetId URL param e.g. domain.com/budgets/{budgetId} 
 */
@Injectable()
export class BudgetExplorerActiveBudgetQuery
{
  protected store = 'active-budget-store';

  private _user!: KuUser;
  // Organisation ID - Needed to resolve budget path.
  private _activeOrg!    : Organisation;

  constructor(_user$$: UserStore,
              _org$$: ActiveOrgStore,
              _router: Router,
              
              private _budgets$$: BudgetsStore,
              private _renderer: BudgetRendererService)
  {
    // Keep track of user and org in the background. 
    _user$$.getUser().subscribe(u => this._user = u);
    _org$$.get().subscribe(o => this._activeOrg = o);
  }

  /** 
   * Gets the budget to render for the budget-viewer/-editor page 
   *    
   * @param budgetId - ID of the budget to render
   * @warning - Only use for budget explorer page or it's children. 
   */
  // TODO(ian): A seperate query needs to monitor edit status and locking of editing of budgets. 
  //            So no two users edit the same budget at the same time else they might override each other.
  get(budgetId: string)
  {
    return this._budgets$$.get()
            // If budgets$$ resolves, we can be sure that orgId and user are set as well.
      .pipe(map((budgets) => budgets.find(b => b.id === budgetId) as Budget));
  }
}
