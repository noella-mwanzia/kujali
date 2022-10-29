import { Injectable } from "@angular/core";
import { RenderedBudget } from "@app/model/finance/planning/budgets";
import { Logger } from "@iote/bricks-angular";
import { BehaviorSubject, filter, Observable, Subscription } from "rxjs";

import { FinancialExplorerState } from "./f-explorer.state.model";

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
  /** Subject which controls the state. */
  private _state$$! : BehaviorSubject<FinancialExplorerState>;

  /** This service has been initialised */
  private _hasLoaded = false;

  /** 
   * This subscription has two uses:
   *  (1) The state is dependent on the rendered budget as calculated from the backend.
   *        In cases of multi-tenant usage, someone else might override the budget currently being rendered.
   *        Warn the user that if they submit changes now, his/her changes will affect the user editing the budget.
   *      TODO: Have editable button which locks/controls the state of a budget.
   *  (2) 
   */
  private _budgetSubscr!: Subscription;

  /** Active year to focus on */
  private _year: number;
  /** The rendered budget we are editing. */
  private _budget!: RenderedBudget;

  constructor(private _logger: Logger)
  { }

  /**
   * This service initialises the state of the financial explorer.
   * 
   * @param budget$ - Rendered budget
   */
  public init(budget$: Observable<RenderedBudget>)
  {
    // Cleanup previous state (if any)
    if(this._hasLoaded)
      this._cleanupPreviousBudgetExplorer();

    // Start initialisation
    this._state$$ = new BehaviorSubject<FinancialExplorerState>(<unknown> null as FinancialExplorerState)

    // We listen to the rendered budget. 
    // If this changes (thus RenderedBudget source fires multiple times) -> someone else edited the budget while I was editing).
    this._budgetSubscr =
      budget$.subscribe(b => {
        if(this._budget) 
        { /* TODO: Set dirty */ }
        else 
          this._budget = b;

        this._updateState();
      });
  }

  /** Return the active explorer state. */
  get = () => this._state$$.asObservable().pipe(filter(s => !!s));

  /**  */
  private _updateState()
  {
    const explorer: FinancialExplorerState = {
      year: this._year,
      
      
    }
  }

  /** 
   * This method is called on init if the state service was already populated with a pre-existing budget.
   *    This happens when the user navigates to multiple explorers (each subsequent page visit will trigger a cleanup).
   */
  private _cleanupPreviousBudgetExplorer()
  {
    this._budgetSubscr.unsubscribe();
    this._budget = <unknown> null as RenderedBudget;

    this._hasLoaded = false;
  }
}