import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatSort, Sort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SubSink } from 'subsink';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';

import { flatMap as __flatMap } from 'lodash';

import { TranslateService } from '@ngfi/multi-lang';

import { __DateFromStorage } from '@iote/time';

import { Contact } from '@app/model/finance/contacts';
import { Company } from '@app/model/finance/companies';
import { Opportunity } from '@app/model/finance/opportunities';
// import { AppClaimDomains } from '@app/model/access-control';

import { OpportunitiesService } from '@app/state/finance/opportunities';
import { KujaliUsersService } from '@app/state/user';
// import { _CheckPermission } from '@app/state/access-control';

import { AddNewOpportunityComponent } from '@app/features/finance/business/opportunities/create';

const DATA: Opportunity[] = []

@Component({
  selector: 'kujali-opportunities-page',
  templateUrl: './opportunities-page.component.html',
  styleUrls: ['./opportunities-page.component.scss']
})

export class OpportunitiesPageComponent implements OnInit, AfterViewInit, OnDestroy {

  private _sbS = new SubSink();

  filterValueSubject: Subject<any> = new Subject<any>();

  filter$$ = new BehaviorSubject<(Opps) => boolean>((c) => true);

  displayedColumns: string[] = ['title', 'assigned-to', 'type', 'company', 'contact', 'deadline', 'status', 'tags'];

  dataSource = new MatTableDataSource(DATA);
  allTableData = this.dataSource.data;

  companiesList: Company[];
  contactsList: Contact[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  showFilter: boolean;
  showGrid: boolean;

  lang: 'fr' | 'en' | 'nl';

  // readonly CAN_CREATE_OPPORTUNITIES = AppClaimDomains.OppsCreate;

  constructor(private cdref: ChangeDetectorRef,
              private dialog: MatDialog,
              private _snackBar: MatSnackBar,
              private _router$$: Router,
              private _translateService: TranslateService,
              private _oppsService: OpportunitiesService,
              private _kujaliUserService: KujaliUsersService
  ) 
  {
    this.lang = this._translateService.initialise();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    const sortState: Sort = { active: 'title', direction: 'asc' };
    this.sort.active = sortState.active;
    this.sort.direction = sortState.direction;
    this.sort.sortChange.emit(sortState);

    this.cdref.detectChanges();
  }

  ngOnInit(): void {
    this._sbS.sink = combineLatest([this.filter$$.asObservable(), this._oppsService.getOpportunities()])
      .subscribe(([filter, cs]) => {
        const filterRecords = cs.filter(filter);
        this.dataSource.data = filterRecords;
        this.allTableData = this.dataSource.data
      });
  }

  getAssignedTo(assigned : string[]) : string[] {
    let users : any = this._kujaliUserService.getOrgUsers(assigned);
    return users;
  }

  setLang(lang: 'en' | 'fr' | 'nl') {
    this._translateService.setLang(lang);
  }

  getContactNames(id: string): string {
    return this._oppsService.getContactNames(id);
  }

  getCompanyNames(id: string): string {
    return this._oppsService.getCompanyNames(id);
  }

  showGridFn() {
    this.showGrid = !this.showGrid
  }

  getDate(activityDate) {
    return __DateFromStorage(activityDate).format('DD/MM/YYYY');
  }

  viewOps(id: string) {
    this._router$$.navigate(['business/opportunities', id]);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  fieldsFilter(value: (Opps) => boolean) {    
    this.filter$$.next(value);
    this.filterValueSubject.next(value);
  }

  toogleFilter(value) {
    this.showFilter = value
  }

  openAddNewDialog() {
    this._sbS.sink = this.dialog.open(AddNewOpportunityComponent, {minWidth: '600px', height: 'fit-content'})
    .afterClosed().subscribe();
  }

  ngOnDestroy = () => this._sbS.unsubscribe();
}