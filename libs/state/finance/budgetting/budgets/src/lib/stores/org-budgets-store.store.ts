import { Injectable } from "@angular/core";

import { filter, map } from "rxjs";
import { flatMap as ___flatMap, includes as ___includes } from 'lodash';

import { Store } from "@iote/state";

import { Budget, BudgetRecord, BudgetStatus, OrgBudgetsOverview } from "@app/model/finance/planning/budgets";

import { BudgetsStore } from './budgets.store';

/**
 * Stores a hierarchical overview of all budgets of an organisation.
 * 
 * Store @type {OrgBudgetsOverview}
 */
@Injectable()
export class OrgBudgetsStore extends Store<OrgBudgetsOverview>
{
  protected store = 'org-budget-store';

  constructor(budgets$$: BudgetsStore) 
  { 
    super(null as any);

    budgets$$.get()
      .subscribe(b => {
        const overview = this._createBudgetsOverview(b);  

        this.set(overview, 'FROM BUDGETS LOAD');
    });
  }

   /**
   * Returns an aggregate of all the user budgets. 
   * 
   * @returns {OrgBudgetsOverview} - A hierarchically sound budget structure created by linking the parent 
   *                                      and child budgets into a tree structure. 
   */
  override get = () => super.get().pipe(filter(bs => !!bs))

  /**
   * Aggregates all the user budgets. 
   * Creates a hierarchically sound budget structure by linking the parent 
   *  and child budgets into a tree structure.
   * 
   * @param budgets - The list of all the budgets a user has access too.
   * @returns {OrgBudgetsOverview} - A hierarchical overview of all budgets.
   */
  private _createBudgetsOverview(budgets: Budget[]): OrgBudgetsOverview
  {
    if (budgets.length == 0)
      return { inUse: [], archived: [], underConstruction: [] };

    // Order of execution is important to lock in budgets!
    const inUse    = budgets.filter(b => b.status == BudgetStatus.InUse);
                          
    const archived = budgets.filter(b => b.status == BudgetStatus.Archived);
                                                                           // Neither status means deleted
    const rest     = budgets.filter(b => (b.status == BudgetStatus.Open || (b.status != BudgetStatus.Archived && b.status != BudgetStatus.InUse)) 
                                            && ! inUse.map(bx => bx.id).includes(b.id) 
                                              && ! archived.map(bx => bx.id).includes(b.id));

    return {
      inUse:  this._createRootTree(inUse, budgets),
      archived: this._createRootTree(archived, budgets),
      underConstruction: this._createRootTree(rest, budgets)
    }
  }

  /**
   * Constructs a budget-overview-tree from the roots down.
   */
  private _createRootTree(filtered: any[], all: any[]): BudgetRecord[]
  {
    const roots = filtered.filter(f => ! ___flatMap(all, a => a.id).includes(f.parentBudgetId));

    const mightBeChildren = all.filter(a => ! ___includes(roots.map(r => r.id), a.id));

    return roots.map(root => this._findChildren(root, mightBeChildren));
  }

  /** Returns child budgets of a current iterated budget. */
  private _findChildren(current: any, availableNodes: any[], parentStatus?: BudgetStatus): BudgetRecord
  {
    // If status is not in use but parent status is locked -> Lock child as well
    if (current.status != BudgetStatus.InUse && parentStatus != null && parentStatus == BudgetStatus.InUse)
      current.status = BudgetStatus.InUse;
    
    const childNodes = availableNodes.filter(node => current.id == node.parentBudgetId);
    // Do not allow recursive budgets nor budgets inheriting their aunts/sisters.
    const childNodePossibleChildren = availableNodes.filter(n => n.id != current.id
                                                                    && !___includes(current.id, n.parentBudgetId));
    
    return {
      budget: current,
      status: current.status,

      children: childNodes.map(ch => this._findChildren(ch, childNodePossibleChildren, current.status)),

      lockedIn: current.status == BudgetStatus.InUse,
    }
  }
}
