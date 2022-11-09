import { Injectable } from '@angular/core';
import { DataService } from '@ngfi/angular';
import { Router } from '@angular/router';

import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { Query } from '@ngfi/firestore-qbuilder';

import { KuUser } from '@app/model/common/user';
import { Organisation } from '@app/model/organisation';

import { Budget } from '@app/model/finance/planning/budgets';
import { BudgetResult } from '@app/model/finance/planning/budget-lines';

import { UserStore } from '@app/state/user';
import { ActiveOrgStore } from '@app/state/organisation';
import { BudgetsStore }   from '@app/state/finance/budgetting/budgets';
import { RenderedChildBudget } from '@app/model/finance/planning/budget-rendering';

/** 
 * A query which can render budgets for the budget explorer and other potential pages.
 * 
 *  - Depends on budgetId URL param e.g. domain.com/budgets/{budgetId} 
 */
@Injectable()
export class BudgetQuery
{
  protected store = 'active-budget-store';

  private _user!: KuUser;
  // Organisation ID - Needed to resolve budget path.
  private _activeOrg!    : Organisation;

  constructor(_user$$: UserStore,
              _org$$: ActiveOrgStore,
              _router: Router,
              
              private _budgets$$: BudgetsStore,
              private _db: DataService)
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

  /**
   * Method which gets budget children from a list of children as configured on the budget.
   * 
   * @param b - Budget which contains the childrenList
   * @returns List of rendered children, which can be interpreted by the parent budget.
   */
  public getBudgetChildren$(b: Budget): Observable<RenderedChildBudget[]>
  {
    if(!b.childrenList || b.childrenList.length === 0)
      return of([]);

    // If there are children, load them
    const budgetQ = new Query().where('id', 'in', b.childrenList);
 
    return this._toChildBudget$(budgetQ);
  }

   /**
    * Get a rendered child budget by ID.
    */
   public getBudgetChildHeader(id: string) : Observable<RenderedChildBudget>
   {
    const childBudgetQ = new Query().where('id', '==', id);
 
     return this._toChildBudget$(childBudgetQ)  
                .pipe(map(ch => ch.length > 0 ? ch[0] 
                                              : <unknown> null as RenderedChildBudget));
   }

   private _toChildBudget$(childBudgetQ: Query)
   {
    return this._db.getRepo<BudgetResult>(`orgs/${this._activeOrg.id}/budgets`)
        .getDocuments(childBudgetQ)
        .pipe(
          map(chBs => chBs.map(chB => 
          ({
            id: chB.id as string,
            name: chB.name,
            header: chB.balance
          }) as RenderedChildBudget)),
          // Block longlasting subscriptions
          take(1));
   }
}
