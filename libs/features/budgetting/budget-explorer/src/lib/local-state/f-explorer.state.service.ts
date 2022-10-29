import { Injectable } from "@angular/core";

import { BehaviorSubject, filter, Subscription } from "rxjs";

import { Logger } from "@iote/bricks-angular";

import { RenderedBudget } from "@app/model/finance/planning/budgets";
import { BudgetExplorerActiveBudgetQuery } from "@app/state/finance/budgetting/rendering";

import { FinancialExplorerState, _DEFAULT_FINANCIAL_EXPLORER_STATE, _FIRST_YEAR_OF_BUDGET } from "../local-model/f-explorer.state.model";

/**
 * This model manages the financial year explorer state.
 *  
 * It controls:
 *  - The year to visualize
 *  - The active budget
 * 
 * @exposes Key observables which depict the current state, as well as methods to update the state.
 * 
 * Local @redux pattern
 */
@Injectable()
export class FinancialExplorerStateService
{
  /** Actual state object. Actions by the components are processed on this object. */
  private _state = _DEFAULT_FINANCIAL_EXPLORER_STATE();
  /** Subject which controls the state. */
  private _state$$  = new BehaviorSubject<FinancialExplorerState>(this._state);

  /** 
   * This subscription has two uses:
   *  (1) The state is dependent on the rendered budget as calculated from the backend.
   *        In cases of multi-tenant usage, someone else might override the budget currently being rendered.
   *        Warn the user that if they submit changes now, his/her changes will affect the user editing the budget.
   *      TODO: Have editable button which locks/controls the state of a budget.
   *  (2) 
   */
  private _budgetSubscr!: Subscription;

  constructor(private _budget$$: BudgetExplorerActiveBudgetQuery,
              private _logger: Logger)
  { }

  /** Return the active explorer state. */
  public get = () => this._state$$.asObservable().pipe(filter(s => !!s));

  /** Triggers an update to the state, meaning something changed in  */
  private _triggerUpdate = () => this._state$$.next(this._state);

  //
  // SECTION - UPDATE STATE
  // 

  public setYear(year: number) {
    this._state.year = year;
    this._triggerUpdate();
  }

  //
  // SECTION - PERSIST STATE
  //


  //
  // SECTION - INITIALISE
  //
   /**
   * This service initialises the state of the financial explorer.
   * 
   * @param budgetId - Id of the budget to render.
   */
  public init(budgetId: string)
  {
    if(this._budgetSubscr)
      this._budgetSubscr.unsubscribe();

    // Start initialisation
    this._state = _DEFAULT_FINANCIAL_EXPLORER_STATE();
    this._triggerUpdate();

    // We listen to the rendered budget. 
    // If this changes (thus RenderedBudget source fires multiple times) -> someone else edited the budget while I was editing).
    this._budgetSubscr =
      this._budget$$.get(budgetId)
          .subscribe(b => this._initialise(b));

    return this.get();
  }

  /**
   * Initialises the state on first load of the rendered budget.
   * The page-state is controlled through a local Redux-like pattern meaning updates from after this method are localized 
   *  to the page.
   * 
   * @param {RenderedBudget} - The newly loaded rendered budget.
   */
  private _initialise(b: RenderedBudget)
  {
    this._state = _DEFAULT_FINANCIAL_EXPLORER_STATE();
    this._state.budget = b;
    this._state.year = _FIRST_YEAR_OF_BUDGET(b); 
    
    this._state.loaded = true;

    this._triggerUpdate();
  }
 
}