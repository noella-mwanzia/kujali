import { Component } from '@angular/core';

import {} from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';

import { Logger } from '@iote/bricks-angular';

import { Budget } from '@app/model/finance/planning/budgets';
import { BudgetExplorerActiveBudgetQuery } from '@app/state/finance/budgetting/budget-detail';
import { FinancialExplorerStateService } from '../../state-local/f-explorer.state.service';

/**
 * This page visualises the Budget Explorer, which is the core feature of this application.
 * The Budget Explorer allows to edit and forecast specific budgets and to see their evolution over x years.
 */
@Component({
  selector: 'app-financial-plan-explorer',
  templateUrl: './financial-plan-explorer.component.html',
  styleUrls: ['./financial-plan-explorer.component.scss']
})
export class FinancialPlanExplorerPageComponent
{
  // private _yearIndex = 0;
  // private _yearIndexSubject = new BehaviorSubject<Number>(0);

 
  /** Supported years */
  years = [];

  budgetId!: string;
  budget$!: Observable<Budget>;
  budget!: Budget;

  minValue = 0;
  maxValue = 1;

  loading = true;

  constructor(_budget$$: BudgetExplorerActiveBudgetQuery,
              private _state$$: FinancialExplorerStateService,
              private _logger: Logger)
  { 
    this.budget$ = _budget$$.get();
    
    // Load in a new state
    _state$$.init(this.budget$);
  }

  ngOnInit() 
  {
    this.yearObserver$ = this._yearSubject.asObservable();

      this.budget$ = this._budgetService.getBudget(params.budgetId);
      this.budget$.subscribe(b => {
        this.budget = b;
        
        this.years = _.range(b.startYear, b.startYear + b.duration);
        this.setYear(new Date().getFullYear() >= b.startYear ? new Date().getFullYear() : b.startYear);
        this.loading = false;
      });
    });
  }

  navigateYear(nav)
  {  
    if (nav === 'prev' && this.year > this.budget.startYear) {
      this.year--;
      this.minValue = this.year % this.budget.startYear;
      this.maxValue = this.minValue + 1;
    }
    else if (nav === 'next' && this.year < this.years[this.years.length - 1]) {
      this.year++;
      this.minValue = this.year % this.budget.startYear;
      this.maxValue = this.minValue + 1;
    }
    else
      this._logger.log(() => "The year you are trying to navigate to does not exist!");

    // Emit change in year.
    this.setYear(this.year);
  }

  setYear(year) {
    this.year = year;
    this._yearSubject.next(year);
  }

  translateStatus(status: BudgetStatus) {
    switch (status) {
      case 'in-use':
        return 'Active';

      case 'open':
        return 'Design';

      case 'archived':
        return 'No Longer in Use';

      case 'deleted':
        return 'Deleted';

      default:
        break;
    }
  }
}


  // private _generateExcelData(source: Observable<any>, total: Observable<any>) {
  //   let reqData = { dataList: [], total: {} };

  //   source.subscribe(dataList => {
  //     reqData.dataList = dataList;
  //   });

  //   total.subscribe(total => {
  //     reqData.total = total;
  //   });

  //   return reqData;
  // }

  // private _getExcelData() {
  //   this.balanceExcelData = this._generateExcelData(this.balanceTable, this.balance);
  //   this.costExcelData = this._generateExcelData(this.costDataSource, this.costTotal);
  //   this.incomeExcelData = this._generateExcelData(this.incomeDataSource, this.incomeTotal);
  // }

  // private _generateExcelDataForYear(excelData, year) {
  //   let body = [];
  //   let totalData = { Category: 'Total', Name: '' };

  //   // For the body data - cell rows that aren't the total
  //   excelData.dataList.forEach(data => {
  //     let res = { Category: data.name, Name: data.isHeader ? '' : data.name };

  //     for (let i = 0; i < data.amountByYearAndMonth[this.years.indexOf(year)].amountPerMonth.length; i++) {
  //       res[this.months[i].name] = data.amountByYearAndMonth[this.years.indexOf(this.year)].amountPerMonth[i].amount;
  //     }

  //     body.push(res);
  //   });

  //   // For the totals
  //   for (let i = 0; i < excelData.total.amountByYearAndMonth[this.years.indexOf(year)].amountPerMonth.length; i++) {
  //     totalData[this.months[i].name] = excelData.total.amountByYearAndMonth[this.years.indexOf(this.year)].amountPerMonth[i].amount;
  //   }

  //   body.push(totalData);

  //   return body;
  // }

  // downloadExcelFile() {
  //   const balanceExcelDataForYear = this._generateExcelDataForYear(this.balanceExcelData, this.year);
  //   const costExcelDataForYear = this._generateExcelDataForYear(this.costExcelData, this.year);
  //   const incomeExcelDataForYear = this._generateExcelDataForYear(this.incomeExcelData, this.year);

  //   this._excelExportService.exportToExcel(balanceExcelDataForYear, costExcelDataForYear, incomeExcelDataForYear);
  // }