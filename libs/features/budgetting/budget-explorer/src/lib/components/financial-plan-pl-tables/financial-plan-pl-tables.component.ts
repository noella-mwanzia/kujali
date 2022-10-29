import { Component, Input, Output, EventEmitter} from '@angular/core';
import { AmountPerYear, BudgetRow } from '@app/model/finance/planning/budget-lines';

import { Observable, combineLatest } from 'rxjs';
import { map, switchMap, filter } from 'rxjs/operators';
import { FinancialExplorerState } from '../../local-model/f-explorer.state.model';


@Component({
  selector: 'app-financial-plan-pl-tables',
  templateUrl: './financial-plan-pl-tables.component.html',
  styleUrls: ['./financial-plan-pl-tables.component.scss']
})
export class FinancialPlanPlTablesComponent
{
  @Input() state$!: Observable<FinancialExplorerState>;
  year$!: Observable<number>;

  @Output() navigateYearPressed = new EventEmitter<'prev' | 'next'>();
  
  // Data Sources
  costDataSource: Observable<BudgetRow>;
  costTotal: Observable<AmountPerYear>;
  incomeDataSource: Observable<BudgetRow>;
  incomeTotal: Observable<AmountPerYear>;
  // Data Sources End


  constructor(private _RenderedBudgetService: RenderedBudgetService,
              private _tableForYearService: TableForYearService)
  { }

  ngOnInit()
  {
    const plan$ = combineLatest(this.year$,
                                this.budget$.pipe(switchMap(budget => this._RenderedBudgetService.getRenderedBudget(budget)),
                                                  filter(r => r != null)));
    
    this.costDataSource =   plan$.pipe(map(([y, table]) => this._tableForYearService.getTableForYear(y, table.costs)));
    this.costTotal =        plan$.pipe(map(([y, table]) => this._tableForYearService.getTotalForYear(y, table.costTotals)));
    this.incomeDataSource = plan$.pipe(map(([y, table]) => this._tableForYearService.getTableForYear(y, table.income)));
    this.incomeTotal =      plan$.pipe(map(([y, table]) => this._tableForYearService.getTotalForYear(y, table.incomeTotals)));
  }

  onPressNavigateYear($event)
  {
    this.navigateYearPressed.emit($event);
  }
}
