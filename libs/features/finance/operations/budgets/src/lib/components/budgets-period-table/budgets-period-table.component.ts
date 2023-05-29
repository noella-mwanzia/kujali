import { Component, Input, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { SubSink } from 'subsink';
import { BehaviorSubject, Subject, combineLatest, filter, map, startWith, switchMap, tap } from 'rxjs';

import { flatMap as __flatMap, groupBy as __groupBy, flatMap } from 'lodash';

import { Invoice } from '@app/model/finance/invoices';
import { MONTHS, YEARS } from '@app/model/finance/planning/time';
import { Expenses } from '@app/model/finance/operations/expenses';
import { TransactionPlan } from '@app/model/finance/planning/budget-items';
import { Budget, BudgetLine, BudgetLinesAllocation } from '@app/model/finance/planning/budgets';

import { BudgetPlansQuery } from '@app/state/finance/budgetting/rendering';
import { BudgetsStateService } from '@app/state/finance/budgetting/budgets';
import { ExpensesStateService } from '@app/state/finance/operations/expenses';
import { InvoicesService } from '@app/state/finance/invoices';

import { BudgetLineAllocUI, BudgetLineUI } from '../../model/budget-line-view.interface';

import { AllocateInvoiceToLineModalComponent } from '../../modals/allocate-invoice-to-line-modal/allocate-invoice-to-line-modal.component';

@Component({
  selector: 'app-budgets-period-table',
  templateUrl: './budgets-period-table.component.html',
  styleUrls: ['./budgets-period-table.component.scss']
})
export class BudgetsPeriodTableComponent implements OnInit {

  private _sbS = new SubSink();

  currentYear = new Date().getFullYear();

  displayedColumns: string[] = ['budget', 'name', 'total', 'action'];
  dataSource = new MatTableDataSource();

  allMonths: BudgetLineUI[];

  allMonthsList = MONTHS;
  month = this.allMonthsList[0];
  activeMonth = MONTHS[0].month.toString();
  monthValue$ = new BehaviorSubject(MONTHS[0]);

  allYearsList = YEARS;
  activeYear = this.currentYear;
  yearValue$ = new BehaviorSubject(this.currentYear);

  budgets: Budget[];
  activeBudget: Budget;
  budgetValue$ = new Subject();

  invoices: Invoice[];
  expenses: Expenses[];
  budgetLineAllocs: BudgetLinesAllocation[];

  constructor(private _dialog: MatDialog,
              private _budgetsStateService$$: BudgetsStateService,
              private _plans$$: BudgetPlansQuery,
              private _expServices: ExpensesStateService,
              private _invoicesService: InvoicesService
  ) { }

  ngOnInit(): void {
    this.getAllTras();
  }

  getAllTras() {
    this._sbS.sink = combineLatest([this._expServices.getAllExpenses(), this._invoicesService.getAllInvoices() ])
                        .pipe(
                          filter(([expenses, invoices]) => !!expenses && !!invoices),
                          tap(([expenses, invoices]) => { this.invoices = invoices; this.expenses = expenses }))
                        .subscribe()

    this._sbS.sink = combineLatest([this.yearValue$, this.monthValue$, this.budgetValue$.pipe(startWith(null)),
                                    this._budgetsStateService$$.getAllBudgets()])
                                      .pipe(
                                        tap(([selectedYear, selectedMonth, selectedBudget, budgets]) => 
                                                { this.activeBudget = !this.activeBudget?.name ? budgets[0] : this.activeBudget }),
                                        tap(([selectedYear, selectedMonth, selectedBudget, budgets]) => 
                                                { this.budgets = budgets.filter((budget) => budget.status === 1) }),
                                        switchMap(([selectedYear, selectedMonth, selectedBudget, budgets]) => 
                                                this.combineData(Number(selectedYear), selectedMonth.month)))
                                      .subscribe();
  }

  combineData(selectedYear: number, selectedMonth: number) {
    return combineLatest(([this._plans$$.getPlans(this.activeBudget), this._budgetsStateService$$.getBudgetLine(),
                            this._budgetsStateService$$.getBudgetLineAllocs()]))
      .pipe(
        map(([plans, budgetLines, budgetLineAllocs]) => {return {plans: plans, lines: this.combineBudgetLineAndBudgetLineAllocs(budgetLines, budgetLineAllocs)}}),
        tap((data: {plans: TransactionPlan[], lines: BudgetLineAllocUI[]}) => {
          const budgetLinesData = data.lines.filter((budgetLine) =>
            (budgetLine.year === Number(selectedYear) && budgetLine.month === selectedMonth - 1 && budgetLine.budgetId === this.activeBudget.id));
          const plan = data.plans.filter((plan) => plan.budgetId === this.activeBudget.id);
          this.allMonths = budgetLinesData.map((line) => this.createBudgetLine(line, plan!));
        }));
  }

  combineBudgetLineAndBudgetLineAllocs(budgetLines: BudgetLine[], budgetLineAllocs: BudgetLinesAllocation[]): BudgetLineAllocUI[] {
    return budgetLines.map((bLine) => {
      const allocs = budgetLineAllocs.find((alloc) => alloc.id === bLine.id)! ?? {};
      return { ...bLine, ...allocs };
    });
  }

  createBudgetLine(budgetLine: BudgetLineAllocUI, plans: TransactionPlan[]): BudgetLineUI {
    const budgetLinePlan = plans.find((plan) => plan.id === budgetLine.lineId);
    const expIds = budgetLine.elements?.map((element) => element.expenseId);
    const allocName = this.expenses.filter((exp) => expIds?.includes(exp.id!)).map((exp) => exp.note).join(', ');

    const budgetLineData: BudgetLineUI = {
      amount: budgetLine.amount,
      baseAmount: budgetLine.baseAmount,
      budgetName: this.activeBudget.name,
      lineName: budgetLinePlan?.lineName!,
      aloocationName: allocName
    }
    return budgetLineData;
  }


  budgetChanged(budget: MatSelectChange) {
    this.activeBudget = budget.value;
    this.budgetValue$.next(budget.value);
  }

  yearChanged(year: MatSelectChange) {
    this.activeYear = year.value;
    this.yearValue$.next(year.value);
  }

  monthChanged(month: MatSelectChange) {
    this.activeMonth = (month.value.month - 1).toString();
    this.month = month.value;
    this.monthValue$.next(month.value);
  }

  absolute(number: number) {
    return Math.abs(number);
  }

  allocateLineToInvoice(line: BudgetLineUI) {
    this._dialog.open(AllocateInvoiceToLineModalComponent, {
      minWidth: '700px',
      data: { budgetLine: line }
    });
  }
}
