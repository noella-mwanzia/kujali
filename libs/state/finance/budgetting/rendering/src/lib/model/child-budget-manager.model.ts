import { BehaviorSubject, Observable } from "rxjs";

import { RenderedChildBudget } from "@app/model/finance/planning/budget-rendering";

import { BudgetQuery } from "../queries/budget.query";
import { Budget } from '@app/model/finance/planning/budgets';

/**
 * AKA as nanny, this class manages the child budgets of the active budget explorer state.
 */
export class ChildBudgetManager
{
  private _cache! : RenderedChildBudget[];
  private _active!: RenderedChildBudget[];

  private _children$$!: BehaviorSubject<RenderedChildBudget[]>;
  private _childrenUpdated$!: Observable<RenderedChildBudget[]>;

  constructor(initial: RenderedChildBudget[], 
              private _activeBudget: Budget,
              private _budgets$: BudgetQuery)
  {
    this._children$$ = new BehaviorSubject(initial);
    this._childrenUpdated$ = this._children$$.asObservable();

    this._cache = initial
    this._active = initial;
  }

  /**
   * @returns  Observer of the children of a budget
   */
  getBudgetChildren$(): Observable<RenderedChildBudget[]>
  {
    return this._childrenUpdated$;
  }

  /**
   * Add a child budget to the master (rendered) budget.
   * 
   * @param child - ID of budget to add to master budget.
   */
  add(child: string)
  {
    if(this._active.find((c) => c.id === child))
        throw new Error('Child already added. Cannot add twice');

    if(this._cache.find((c) => c.id === child)) 
    {
      this._active.push(this._cache.find((c) => c.id === child) as RenderedChildBudget);
      this._refresh();
    }
    else {
      const child$ = this._budgets$.getBudgetChildHeader(child);
      
      child$.subscribe(ch => {
        this._active.push(ch);
        this._cache.push(ch);

        this._refresh();
      });
    }
  }

  /** Remove a child budget from the budget. */
  remove(child: string)
  {
    this._active = this._active.filter(a => a.id !== child);
    this._refresh();
  }
    
  private _refresh()
  {
    this._children$$.next(this._active);
  }

}