import { Component, Input, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';

import { SubSink } from 'subsink';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';

import { flatMap, flatMap as __flatMap, groupBy, groupBy as __groupBy, orderBy, sortBy} from 'lodash';

import { MONTHS, YEARS } from '@app/model/finance/planning/time';

import { OperationBudgetsQuery } from '@app/state/finance/budgetting/rendering';

import { Month } from '@app/model/finance/planning/budget-items';
import { BudgetsStore } from '@app/state/finance/budgetting/budgets';
import { BudgetPlansQuery } from 'libs/state/finance/budgetting/rendering/src/lib/queries/budget-lines.query';

@Component({
  selector: 'app-budgets-period-table',
  templateUrl: './budgets-period-table.component.html',
  styleUrls: ['./budgets-period-table.component.scss']
})
export class BudgetsPeriodTableComponent implements OnInit {

  private _sbS = new SubSink();

  @Input() operationLines: any;
  @Input() orgId: string;
  @Input() yearIndex: string = '2022';

  yearValue$ = new BehaviorSubject('2022');
  monthValue$ = new BehaviorSubject(MONTHS[0]);

  displayedColumns: string[] = ['budget', 'name', 'total', 'action'];
  dataSource;

  currMonth: string = MONTHS[0].name;
  
  allMonths: any;;

  allMonthsList = MONTHS;
  month = this.allMonthsList[0];
  allYearsList = YEARS;

  allTransactions: any;

  currentMonthValues: any;

  activeYear = YEARS[0];
  activeMonth = MONTHS[0].month.toString();

  constructor(private opsMonths$$: OperationBudgetsQuery,
              private _budgets$$: BudgetsStore,
              private _plans$$: BudgetPlansQuery
    ) {}

  ngOnInit(): void {
    this.getAllTras();
  }

  getAllTras() {
    this._sbS.sink = this.yearValue$.subscribe((year) => {

        this.opsMonths$$.getYearMonths(this.orgId, year).subscribe((months) => {
          let monthsO = months.map((d, index) => {return {...d, index: index}})
          this.allMonths = monthsO
        });
    })
  }

  yearChanged(year: MatSelectChange) {
    this.activeYear = year.value;
    this.yearValue$.next(year.value);
  }

  flattenMonths(months): any {
    let m = groupBy(flatMap(months), 'id')
    this.dataSource = m[this.activeMonth]
    return m;
  }

  monthChanged(month: MatSelectChange) {
    this.activeMonth = (month.value.month - 1).toString();
    this.month = month.value;
    this.monthValue$.next(month.value);
  }

  absolute(number) {
    return Math.abs(number);
  }


}
