import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { BudgetRowType } from '@app/model/finance/planning/budget-grouping';
import { BudgetRowYear } from '@app/model/finance/planning/budget-lines-by-year';
import { FinancialExplorerState } from '@app/model/finance/planning/budget-rendering-state';

import { FinancialExplorerStateService } from '@app/state/finance/budgetting/rendering';

import { LinkBudgetModalComponent } from '../link-budget-modal/link-budget-modal.component';
import { BackendService } from '@ngfi/angular';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

@Component({
  selector: 'app-financial-plan-result-table',
  templateUrl: './financial-plan-result-table.component.html',
  styleUrls: ['./financial-plan-result-table.component.scss']
})
export class  FinancialPlanResultTableComponent implements OnInit, OnDestroy
{
  private _sBs!: Subscription;

  @Input() state$!: Observable<FinancialExplorerState>;
  @Input() budgetId: string;

  @Output() budgetSubmitted = new EventEmitter();

  balanceTable$!: Observable<BudgetRowYear[]>;
  balance$!     : Observable<BudgetRowYear>;

  tableType = BudgetRowType.Result;

  budgetSubmitting: boolean = false;
  budgetActivating: boolean = false;

  constructor(private _dialog: MatDialog, private _bs: FinancialExplorerStateService)
  { }

  ngOnInit() {
    this.balanceTable$ = this.state$.pipe(map(res => [res.scopedCostTotals, res.scopedIncomeTotals].concat(res.scopedChildBudgets).concat([res.scopedResult])));
    this.balance$      = this.state$.pipe(map(res => res.scopedBalance));
  }

  linkChildModal() 
  {
    this._dialog.open( LinkBudgetModalComponent, 
        { data: this.budgetId })
    .afterClosed();
  }

  downloadExcelFile() {
    console.log('Service does not exist');
  }

  activateBudget() {
    this.budgetActivating = true;
    this._bs.activateBudget().subscribe(() => this.budgetActivating = false);
  }

  submitBudget() {
    this.budgetSubmitting = true;
    this.budgetSubmitted.emit();

    setTimeout(() => {
      this.budgetSubmitting = false;
    }, 2000);
  }

  // fecthPontoTrs() {
  //   this._bs.httpsCallable('fetchPontoUserBankTransactions')({ orgId: '24og1rpbhzXTkw8NJY7WGuHmGWN2', orgAccId: 'asnfslakndfsalfd' }).subscribe(() => {});
  // }

  ngOnDestroy(): void {
    if(this._sBs)
      this._sBs.unsubscribe();
  }
}
