import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, EventEmitter, Input, 
  Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';

import { Budget, BudgetRecord, OrgBudgetsOverview } from '@app/model/finance/planning/budgets';

import { ShareBudgetModalComponent } from '../share-budget-modal/share-budget-modal.component';
import { CreateBudgetModalComponent } from '../create-budget-modal/create-budget-modal.component';

@Component({
  selector: 'app-budget-table',
  templateUrl: './budget-table.component.html',
  styleUrls: ['./budget-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class BudgetTableComponent {

  @Input() budgets: BudgetRecord[] = [];
  @Input() canPromote = false;

  @Output() doPromote: EventEmitter<void> = new EventEmitter();

  dataSource: MatTableDataSource<BudgetRecord>;

  displayedColumns: string[] = ['caret', 'name', 'status', 'startYear', 'endYear', 'duration', 'actions'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('outerSort', { static: true }) sort: MatSort;
  @ViewChildren('innerSort') innerSort: QueryList<MatSort>;
  @ViewChildren('innerTables') innerTables: QueryList<MatTable<BudgetRecord>>;

  budgetsData: any = [];
  expandedElement: BudgetRecord;

  constructor(private _router$$: Router, private _dialog: MatDialog, private _cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    const budgets = this.budgets.map((budget) => {budget.budget['endYear'] = budget.budget.startYear + budget.budget.duration - 1; return budget;})
    this.combineData(budgets);
  }

    /** 
   * Checks whether the user has access to a certain feature.
   * 
   * @TODO @IanOdhiambo9 - Please put proper access control architecture in place. 
   */
    access(requested:any) 
    {  
      switch (requested) {
        case 'view':
        case 'clone':
          return true; //budget.access.owner || budget.access.view || budget.access.edit;
        case 'edit':
          return true; // (budget.access.owner || budget.access.edit) && budget.status !== BudgetStatus.InUse && budget.status !== BudgetStatus.InUse;
      }
      
      return false;
    }

  combineData (budgets: BudgetRecord[]) {
    budgets.map(budget => {
      if (budget.children && Array.isArray(budget.children) && budget.children.length > 0) {
        this.budgetsData = [...this.budgetsData, {...budget, children: new MatTableDataSource(budget.children)}];
      } else {
        this.budgetsData = [...this.budgetsData, budget];
      }
    });

    this.dataSource = new MatTableDataSource(this.budgetsData);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  toggleRow(element: any) {
    element.children && (element.children as MatTableDataSource<any>).data?.length ? (this.expandedElement = this.expandedElement === element ? null : element) : null;
    this._cd.detectChanges();
    this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<any>).sort = this.innerSort.toArray()[index]);    
  }

  applyFilter(filterValue: string) {
    this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<any>).filter = filterValue.trim().toLowerCase());
  }

  filterAccountRecords(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  promote() {
    if (this.canPromote)
      this.doPromote.emit();
  }

  /** Open share screen to configure budget access. */
  openShareBudgetDialog(parent: Budget | false): void 
  {
    this._dialog.open(ShareBudgetModalComponent, {
      panelClass: 'no-pad-dialog',
      width: '600px',
      data: parent != null ? parent : false
    });
  }

  /** Open clone screen to clone and reconfigure budget. */
  openCloneBudgetDialog(parent: Budget | false): void {
    this._dialog.open(CreateBudgetModalComponent, {
      height: 'fit-content',
      width: '600px',
      data: parent != null ? parent : false
    });
  }

  goToDetail(budgetId: string, action: string) {
    this._router$$.navigate(['budgets', budgetId, action]);
  }

  translateStatus(status: number) {
    switch (status) {
      case 1:
        return 'BUDGET.STATUS.ACTIVE';
      case 0:
        return 'BUDGET.STATUS.DESIGN';
      case 9:
        return 'BUDGET.STATUS.NO-USE';
      case -1:
        return 'BUDGET.STATUS.DELETED';
      default:
        return '';
    }
  }
}
