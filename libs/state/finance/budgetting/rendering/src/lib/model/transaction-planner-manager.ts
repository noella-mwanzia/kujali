import { BehaviorSubject, Observable } from "rxjs";

import { TransactionPlan } from "@app/model/finance/planning/budget-items";

/**
 * This class manages plans and, by extension, budget lines of the active budget explorer state.
 */
export class TransactionPlannerManager
{
  // private _cache! : TransactionPlan[]; -> @note As we don't have to go to the backend here, we don't need a cache.
  private _active!: TransactionPlan[];

  private _plans$$!: BehaviorSubject<TransactionPlan[]>;
  private _plans$!: Observable<TransactionPlan[]>;

  constructor(initial: TransactionPlan[],)
  {
    this._plans$$ = new BehaviorSubject(initial);
    this._plans$ = this._plans$$.asObservable();

    this._active = initial;
  }

  /**
   * @returns  Observer of the children of a budget
   */
  getTransactionPlans$(): Observable<TransactionPlan[]>
  {
    return this._plans$;
  }

  /**
   * Add a transaction plan to the master (rendered) budget.
   */
  add(plan: TransactionPlan)
  {
    // 1. Validate! We can't add a second king
    if(this._active.find(p => p.trTypeId === plan.trTypeId && p.king && plan.king))
      throw new Error('There cannot be two king (template) transaction plans of the same line');

    this._active.push(plan);
    this._refresh();
  }

  /** Remove a plan from the budget. */
  remove(plan: TransactionPlan)
  {
    // If the king is being removed, attempt to transfer the kingship
    // If not, this will be the last line and the line will automatically be removed.
    if(plan.king)
    {
      const longLiveTheKing = this._active.find(p => p.trTypeId === plan.trTypeId && p.id !== plan.id);
      if(longLiveTheKing)
        longLiveTheKing.king = true;
    }

    this._active = this._active.filter(a => a.id !== plan.id);
    this._refresh();
  }

  /** 
   * Remove a line from the budget. 
   * Removes all plans of the line.
   */
  removeLine(trTypeId: string)
  {
    this._active = this._active.filter(a => a.trTypeId !== trTypeId);
    this._refresh();
  }
    
  private _refresh()
  {
    this._plans$$.next(this._active);
  }

}