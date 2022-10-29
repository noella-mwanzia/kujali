import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { PlanTransactionModal } from '../../../transaction-planner/components/plan-transaction-modal/plan-transaction-modal.component';
import { MatDialog } from '@angular/material/dialog';

import { CellTransactionOccurrenceModal } from '../../../transaction-planner/components/cell-tr-occurrence-modal/cell-tr-occurrence-modal.component';

import { PlanTransactionService } from '../../../transaction-planner/services/plan-transaction.service';
import { BudgetRowMonths } from '../../model/budget-row-months.interface';

import { MONTHS, YEARS, NULL_AMOUNT_PER_MONTH } from '@elewa/portal-shared';


const _EMPTY_CELL_DATA = (month, year, type) => ({ monthFrom: month, yearFrom: year, type: type, amount: 0, units: 0, update: true });

@Component({
  selector: 'app-financial-plan-table',
  styleUrls: ['financial-plan-table.component.scss'],
  templateUrl: 'financial-plan-table.component.html',
})
export class FinancialPlanTableComponent
{
  constructor(public dialog: MatDialog, 
              private _activateRoute: ActivatedRoute, 
              private _plannedTransactionService: PlanTransactionService) 
  { }

  monthColumns = MONTHS;
  years: Array<number> = YEARS; 
  // Listing of the columns to render
  columns: string[];

  budgetId;

  @Input() year: number;
  @Input() type: string;
  @Input() dataSource: Observable<BudgetRowMonths[]>;
  @Input() total: BudgetRowMonths;

  @Input() classId: string; 

  @Input() allowAdd = true;
  @Input() nameField = true;

  savingTransactions : number = 0;

  ngOnInit()
  {
   this.columns = ['transactionCat'].concat(this.nameField ? ['transactionType'] : [])
                                    .concat(_.map(MONTHS, (m) => m.slug))
                                    .concat('total').concat('action');
    
    this._activateRoute.params.subscribe(param => this.budgetId = param.budgetId);
  }

  // -- Render Table
  
  getCategory(cell) {
    return (cell.isHeader || cell.type == 'childResult')
              ? cell.name
              : cell.type;
  }

  getName(cell) {
    return !cell.isHeader ? cell.name
                          : '';
  }

  getAmount(cell: BudgetRowMonths, column) 
  {         
    return this._formatPrice(Math.abs(this._getCellValue(cell, column).amount));
  }

  getTotalAmountM(column)
  {
    return this._formatPrice(Math.abs(this._getCellValueForTotal(column).amount));
  }

  getTotal(cell: BudgetRowMonths)
  {
    try {
      return this._formatPrice(cell.total);
    }
    catch(e) { return 0; }
  }

  getTotalAmountY()
  {
    try {
      return this.total ? this._formatPrice(Math.abs(this.total.total))
                        : '0';
    }
    catch(e) { return 0; }
  }

  // -- CSS

  getClassesCell(row: BudgetRowMonths, col)
  {
    const classes = [];
    const value = this._getCellValue(row, col);

    if (row.isHeader || row.type == 'childResult')
      classes.push(this._getClassesTotal(value.amount));
    else
    {
      classes.push('cell-intrct');
      if (value.isOccurenceStart) classes.push('occurence-start');
    }
    return classes;
  }

  getClassesM(col)
  {
    return this._getClassesTotal(this._getCellValueForTotal(col).amount);
  }

  getClassesRow(row) {
    return (row.isHeader) ? ['header-row'] : [];
  }

  getClassesTotal(cell)
  {
    try {
      const value = this.total;
      return this._getClassesTotal(value);
    }
    catch(e) { return ''; }
  }

  getClassesTotalY() {
    try {
      return this.total ? this._getClassesTotal(this.total) : '';
    }
    catch(e) { return ''; }
  }
  
  private _getClassesTotal(value) { return (value == 0) ? ('zero') : (value > 0 ? 'positive' : 'negative'); }

  // -- Get Cell Values

  private _getCellValueForTotal(column: any) {
    try {
      return this.total.amountsMonth[column.month - 1];
    }
    catch(e) { return NULL_AMOUNT_PER_MONTH() }
  }

  private _getCellValue(row: BudgetRowMonths, column: any)
  {
    try {
      return row.amountsMonth[column.month - 1];
    }
    catch (e) { return NULL_AMOUNT_PER_MONTH(); }
  }

  private _formatPrice(price) {
    return Math.round(price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // -- Create and Update Rows

  openPlanTransactionModal(m : any): void
  {
    this.dialog.open(PlanTransactionModal, {
      data: { month: m.month, year: this.year, type: this.type, budgetId: this.budgetId }
    })
    .afterClosed()
    .subscribe((saving: Observable<any> | false) => { if (saving) this._addCounterSaving(saving); });
  }

  openCellModal(cell: BudgetRowMonths, column)
  {
    const amount = this._getCellValue(cell, column);

    const data = (cell && !cell.isHeader) ? ({
                    monthFrom: column.month,
                    yearFrom: this.year,
                    type: this.type,
                    amount: amount.baseAmount,
                    units: amount.units,
                    update: amount.isOccurenceStart,
                    // transaction: cell.transaction, 

                    budgetId: this.budgetId, 
                    occurence: cell.amountsMonth[column.month - 1].occurence 
                  })
                  : _EMPTY_CELL_DATA(column.month, this.year, this.type);

    this.dialog.open(CellTransactionOccurrenceModal, { data })
               .afterClosed()
               .subscribe((saving: Observable<any> | false) => { if (saving) this._addCounterSaving(saving); });
  }


  /** Counter for when transactions are being saved. */
  private _addCounterSaving(transaction: Observable<any>) 
  {
    this.savingTransactions++;

    transaction.pipe(take(1))
                .subscribe(_ => {
                  if (this.savingTransactions && this.savingTransactions > 0)
                    this.savingTransactions--;
                });
  }

  deleteTransaction(transaction) {
    let isConfirmed = confirm("Are you sure you want to delete this transaction? Click ok to continue"); 

    if(isConfirmed) {
      this._plannedTransactionService.deletePlannedTransaction(transaction); 
    }
  }

}
