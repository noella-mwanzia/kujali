import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BudgetRowType } from '@app/model/finance/planning/budget-lines';
import { BudgetRowYear } from '@app/model/finance/planning/budget-lines-by-year';

import { FinancialExplorerState } from '@app/state/finance/budgetting/rendering';

import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { LinkBudgetModalComponent } from '../link-budget-modal/link-budget-modal.component';

@Component({
  selector: 'app-financial-plan-result-table',
  templateUrl: './financial-plan-result-table.component.html',
  styleUrls: ['./financial-plan-result-table.component.scss']
})
export class  FinancialPlanResultTableComponent implements OnInit, OnDestroy
{
  private _sBs!: Subscription;

  @Input() state$!: Observable<FinancialExplorerState>;

  balanceTable$!: Observable<BudgetRowYear[]>;
  balance$!     : Observable<BudgetRowYear>;

  tableType = BudgetRowType.Result;

  constructor(private _dialog: MatDialog)
  { }

  ngOnInit() {
    this.balanceTable$ = this.state$.pipe(map(res => [res.scopedCostTotals, res.scopedIncomeTotals].concat(res.scopedChildBudgets).concat([res.scopedResult])));
    this.balance$      = this.state$.pipe(map(res => res.scopedBalance));
  }

  linkChildModal() 
  {
    // this._sBs = 
    //   this._dialog.open(
    //     LinkBudgetModalComponent, 
    //     { data: this.budget })
    //  .afterClosed();
  }

  downloadExcelFile() {
    console.log('Service does not exist');
  }

  ngOnDestroy(): void {
    if(this._sBs)
      this._sBs.unsubscribe();
  }
}
