import { Injectable } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';

import { Observable, combineLatest } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';

import { Budget } from '@app/model/finance/planning/budgets';

import { UserStore } from '@app/state/user';
import { ActiveOrgStore } from '@app/state/organisation';

import { BudgetsStore } from '../stores/budgets.store';

/** Route stub which equals the 2nd param of the budget sub-routes */
const BUDGET_ROUTE_TOKEN = 'budgets';

/** 
 * Determines active budget 
 *  - Depends on 3rd URL param e.g. domain.com/budgets/{budgetId} 
 * 
 * Only used in budget editor!
 */
@Injectable()
export class BudgetExplorerActiveBudgetQuery
{
  protected store = 'active-budget-store';

  // Caching params to avoid duplicate streams
  private _activeOrg!    : string;
  private _activeBudget! : string;
  private _budgetCache$! : Observable<Budget> | null;

  // Query dependencies
  private _budgets$!        : Observable<Budget[]>;
  /** Prerequisites for constructing budgets -> @type [OrganisationId, PageName, BudgetId] */
  private _budgetDetailsQ$! : Observable<[string, string, string]>;

  constructor(_org$$: ActiveOrgStore,
              _budgets$$: BudgetsStore,
              _user$$: UserStore,
              _router: Router)
  {
    const org$ = _org$$.get();
    this._budgets$ = _budgets$$.get();

    const route$ = _router.events.pipe(filter((ev: Event) => ev instanceof NavigationEnd),
                                        map(ev => ev as NavigationEnd));
   
    this._budgetDetailsQ$ =
      combineLatest([org$, route$])
        .pipe(map(([o, r]) => [o.id as string, this._getPageFromRoute(r), this._getBudgetIdFromRoute(r)]));
  }

  /** 
   * Gets the budget to render for the budget-viewer/-editor page 
   *    
   * @warning - Only use for budget explorer page or it's children. 
   */
  get()
  {
    return this._budgetDetailsQ$
      .pipe(take(1),
            tap(([oId, page, bId]) => this._validate(oId, page, bId)),
            switchMap(() => {
              // If active has not yet been retrieved or was invalidated, construct the active-budget query
              if(!this._budgetCache$)
                this._budgetCache$ = this._budgets$.pipe(map(bs => bs.find(b => b.id === this._activeBudget) as Budget));

              return this._budgetCache$ as Observable<Budget>;
            }));
  }
  
  /** Validates the budget request. */
  private _validate(oId: string, page: string, bId: string)
  {
    if(oId !== this._activeOrg || bId !== this._activeBudget)
    {
      // Invalidate cache when budget changes. This means that between the past and current navigation to budget explorer, 
      //    the user changed routes.
      this._budgetCache$ = null;
      this._activeOrg = oId;
      this._activeBudget = bId;
    }

    if(page !== BUDGET_ROUTE_TOKEN)
      throw new Error(`Unauthorized. Requesting budget from explorer service while not on the budget explorer page.`)

    return true;
  }

  /** Slice page ID */
  private _getPageFromRoute = (r: NavigationEnd) => this._getRouteSegment(r, 2);
  /** Slice budget ID */
  private _getBudgetIdFromRoute = (r: NavigationEnd) => this._getRouteSegment(r, 2);

  /**
   * Slices a route segment out of the total route.
   * 
   * @param r       - Route to slice from
   * @param segment - Route segment to slice (n+1)
   */
  private _getRouteSegment(r: NavigationEnd, segment: number) : '__noop__' | string
  {
    const elements = r.url.split('/');
    const sliced = elements.length >= segment ? elements[segment-1] : '__noop__';

    return sliced;
  }
}
