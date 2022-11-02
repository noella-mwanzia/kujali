import { Component, Input, Output, EventEmitter, OnInit} from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { FinancialExplorerState } from '@app/state/finance/budgetting/rendering';
import { BudgetHeaderYear, BudgetRowYear } from '@app/model/finance/planning/budget-lines-by-year';


@Component({
  selector: 'app-financial-plan-pl-tables',
  templateUrl: './financial-plan-pl-tables.component.html',
  styleUrls: ['./financial-plan-pl-tables.component.scss']
})
export class FinancialPlanPlTablesComponent implements OnInit
{
  @Input() state$!: Observable<FinancialExplorerState>;
  year$!: Observable<number>;

  @Output() navigateYearPressed = new EventEmitter<'prev' | 'next'>();
  
  // Data Sources
  costDataSource$!  : Observable<BudgetRowYear[]>;
  costTotal$!       : Observable<BudgetHeaderYear>;
  incomeDataSource$!: Observable<BudgetRowYear[]>;
  incomeTotal$!     : Observable<BudgetHeaderYear>;
  // Data Sources End

  ngOnInit()
  {  
    const state$ = this.state$; // state$ is configured to only fire on events where state.isLoaded
    
    this.costDataSource$   = state$.pipe(map((state) => state.scopedCosts));
    this.costTotal$        = state$.pipe(map((state) => state.scopedCostTotals));
    this.incomeDataSource$ = state$.pipe(map((state) => state.scopedIncome));
    this.incomeTotal$      = state$.pipe(map((state) => state.scopedIncomeTotals));
  }

  onPressNavigateYear($event: 'prev' | 'next')
  {
    this.navigateYearPressed.emit($event);
  }
}
