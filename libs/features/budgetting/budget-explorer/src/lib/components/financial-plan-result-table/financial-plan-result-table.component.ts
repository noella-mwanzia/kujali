import { Component, Input, OnInit } from '@angular/core';

import { Observable, combineLatest } from 'rxjs';
import { map, switchMap, filter } from 'rxjs/operators';
import * as _ from 'lodash';

import { BudgetResultService } from '../../service/budget-result.service';
import { TableForYearService } from '../../service/table-for-year.service';

import { BudgetResult, BudgetResultYear, Budget } from '@elewa/portal-shared';
import { BudgetRowMonths } from '../../model/budget-row-months.interface';
import { MatDialog } from '@angular/material/dialog';
import { LinkBudgetModalComponent } from '../link-budget-modal/link-budget-modal.component';

@Component({
  selector: 'app-financial-plan-result-table',
  templateUrl: './financial-plan-result-table.component.html',
  styleUrls: ['./financial-plan-result-table.component.scss']
})
export class  FinancialPlanResultTableComponent implements OnInit
{
  budget: Budget;
  @Input() budget$: Observable<Budget>;
  @Input() year$: Observable<Number>;

  balanceTable$: Observable<BudgetRowMonths[]>;
  resultTable$: Observable<BudgetResultYear>;
  balance$: Observable<BudgetRowMonths>;

  constructor(private _budgetResultService: BudgetResultService, 
              private _tableForYearService: TableForYearService,
              private _dialog: MatDialog)
  { }

  ngOnInit() {
    this.resultTable$ = combineLatest(this.year$,
                                      this.budget$.pipe(switchMap(budget => this._budgetResultService.getBudgetResult(budget.id)),
                                                        filter(r => r != null)))
                                     .pipe(map(([y, result]) => 
                                        this._toYearResult(<number> y, result)));

    this.balanceTable$ = this.resultTable$.pipe(map(res => [res.costTotals, res.incomeTotals].concat(res.childResults).concat([res.result])));
    this.balance$ = this.resultTable$.pipe(map(res => res.balance));

    this.budget$.subscribe(unpacked => this.budget = unpacked);
  }

  _toYearResult(y: number, result: BudgetResult): BudgetResultYear
  {
    const mRes = <BudgetResultYear> <any> _.clone(result);
    
    mRes.year = y;
    mRes.childResults = this._tableForYearService.getTableForYear(y, result.childResults);
    mRes.costTotals   = this._tableForYearService.getTotalForYear(y, result.costTotals);
    mRes.incomeTotals = this._tableForYearService.getTotalForYear(y, result.incomeTotals);
    mRes.result       = this._tableForYearService.getTotalForYear(y, result.result);
    mRes.balance      = this._tableForYearService.getTotalForYear(y, result.balance);
    
    return mRes;
  }

  linkChildModal() {
    const dialogRef = this._dialog.open(LinkBudgetModalComponent, {
                        data: this.budget
                      });
  }

  downloadExcelFile() {
    console.log('Service does not exist');
  }
}
