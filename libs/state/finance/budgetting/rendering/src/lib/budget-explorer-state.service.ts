import { Injectable } from "@angular/core";

import { BehaviorSubject, combineLatest, filter, map, Observable, Subscription, take, tap } from "rxjs";

import { Logger } from "@iote/bricks-angular";

import { FinancialExplorerState } from "@app/model/finance/budgetting/budget-rendering-state";
import { _DEFAULT_FINANCIAL_EXPLORER_STATE, _FIRST_YEAR_OF_BUDGET, _YEARS_RANGE_OF_BUDGET } from "./model/f-explorer.state.model";

import { Budget } from "@app/model/finance/planning/budgets";
import { TransactionPlan } from "@app/model/finance/planning/budget-items";
import { RenderedBudget, RenderedChildBudget } from "@app/model/finance/planning/budget-rendering";

import { BudgetQuery } from "./queries/budget.query";
import { BudgetPlansQuery } from "./queries/budget-lines.query";
import { BudgetRendererService } from "./queries/budget-renderer.service";

import { ChildBudgetManager } from "./model/child-budget-manager.model";
import { TransactionPlannerManager } from "./model/transaction-planner-manager";
import { __ScopeStateToYear } from "./model/scope-table-to-year.function";


/**
 * This model manages the financial year explorer state.
 *  
 * It controls:
 *  - The year to visualize
 *  - The active budget
 *  - The rendering of the budget
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

  // State dependencies
  private _budgetPlan$$!: TransactionPlannerManager;
  private _childBudgets$$!: ChildBudgetManager;

  private _budget$!: Observable<RenderedBudget>;

  /** 
   * This subscription has two uses:
   *  (1) The state is dependent on the rendered budget as calculated from the backend.
   *        In cases of multi-tenant usage, someone else might override the budget currently being rendered.
   *        Warn the user that if they submit changes now, his/her changes will affect the user editing the budget.
   *      TODO: Have editable button which locks/controls the state of a budget.
   *  (2) 
   */
  private _budgetSubscr!: Subscription;

  constructor(private _budget$$: BudgetQuery,
              private _budgetPlans$: BudgetPlansQuery,
              private _renderer: BudgetRendererService,
              private _logger: Logger)
  { }

  /** Return the active explorer state. */
  public get = () => this._state$$.asObservable()
          .pipe(filter(s => s.loaded),
                tap(s => __ScopeStateToYear(s)),
                filter(s => !!s));

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
    // If this changes (thus Budget source fires multiple times) -> someone else edited the budget while I was editing).
    // TODO(ian): Lock changes to Budget when someone is editing [else this will cause an annoying bug]
    const budget$ = this._budget$$.get(budgetId);

    this._budgetSubscr = 
      budget$.subscribe(b => 
            this._startInitialisation(b));

    return this.get();
  }

  /**
   * Initialises the state on first load of the rendered budget.
   * The page-state is controlled through a local Redux-like pattern meaning updates from after this method are localized 
   *  to the page.
   * 
   * This method sets up the initialisation of the local state.
   * 
   * @param {Budget} - The budget for which to load the explorer.
   */
  private _startInitialisation(b: Budget)// children: RenderedChildBudget[], plans: TransactionPlan[])
  {
    // 1. Start initialisation - Set initial state params
    this._state = _DEFAULT_FINANCIAL_EXPLORER_STATE();
    
    this._state.year = _FIRST_YEAR_OF_BUDGET(b); 
    this._state.years = _YEARS_RANGE_OF_BUDGET(b);
    
    this._triggerUpdate();

    // 2. Load in the transaction explorer table
    const plans$ = this._budgetPlans$.getPlans(b);
    const children$ = this._budget$$.getBudgetChildren$(b);

    this._budgetSubscr.add(
      // Initialize dependencies
      combineLatest([children$, plans$])
        .pipe(take(1)) // Initialisation so we only want one
        .subscribe(([c, p]) => this._finalizeInit(b, c, p)));
  }
    
  private _finalizeInit(b: Budget, c: RenderedChildBudget[], p: TransactionPlan[])
  {
    // Initialise the state manager for the child budgets. 
    this._childBudgets$$ = new ChildBudgetManager(c, b, this._budget$$);
    this._budgetPlan$$   = new TransactionPlannerManager(p);

    // The final load loop. The following lines manage state and auto-update the state in 
    //    case of local changes
    this._budget$ = combineLatest(
          [this._childBudgets$$.getBudgetChildren$(),
           this._budgetPlan$$.getTransactionPlans$()])
      .pipe(
        map(([children, transactions]) =>
          this._renderer.render(b, children, transactions)));
    
    // Once we have the data, update state and set loaded
    this._budgetSubscr.add(
      this._budget$.subscribe(b => 
      {
        this._state.budget = b;
        this._state.loaded = true;

        this._triggerUpdate();
      })
    );
  }
 
}