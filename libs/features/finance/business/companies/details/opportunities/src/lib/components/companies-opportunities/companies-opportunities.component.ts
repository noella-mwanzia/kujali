import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { SubSink } from 'subsink';

import { combineLatest } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import { __DateFromStorage } from '@iote/time';

import { Opportunity } from '@app/model/finance/opportunities';
import { Company } from '@app/model/finance/companies';
import { AppClaimDomains } from '@app/model/access-control';

import { OpportunitiesService, OpportunitiesStore } from '@app/state/finance/opportunities'
import { ActiveCompanyStore } from '@app/state/finance/companies';
import { KujaliUsersService } from '@app/state/user';

import { AddNewOpportunityComponent } from '@app/features/finance/business/opportunities/create';

const DATA: Opportunity[] = []

@Component({
  selector: 'companies-opportunities',
  templateUrl: './companies-opportunities.component.html',
  styleUrls: ['./companies-opportunities.component.scss']
})
export class CompaniesOpportunitiesComponent implements OnInit {

  private _sbS = new SubSink();

  @Input() canViewOpps: boolean;

  displayedColumns: string[] = ['title', 'assigned-to', 'contact', 'deadline', 'status', 'tags'];
  dataSource = new MatTableDataSource(DATA);

  activeCompany: Company;

  @Output() oppsListLenEvent = new EventEmitter();

  readonly CAN_CREATE_OPPS = AppClaimDomains.OppsCreate;

  constructor(private dialog: MatDialog,
              private _router$$: Router,
              private _company$$: ActiveCompanyStore,
              private _opps$$: OpportunitiesStore,
              private _oppsService: OpportunitiesService,
              private _kujaliUserService: KujaliUsersService
  ) { }

  ngOnInit(): void {
    this.getPageData();
  }

  getPageData() {
    this._sbS.sink = combineLatest(([this._company$$.get(), this._opps$$.get()]))
    .pipe(
      filter(([c, v]) => !!c && !!v),
      tap(([c, v]) => { this.activeCompany = c }))

    .subscribe(([c, v]) => {
      this.dataSource.data = v
        .filter((cs) => { return cs.company ? cs.company == this.activeCompany.id : null })

      this.getOppsLen(this.dataSource.data.length.toString())
    })
  }

  getOppsLen(value: string) {
    this.oppsListLenEvent.emit(value)
  }

  getAssignedTo(assigned : string[]) : string[] {
    let users : any = this._kujaliUserService.getOrgUsers(assigned);
    return users;
  }

  getDate(date) {
    return __DateFromStorage(date).format("DD/MM/YYYY")
  }

  getContactName(id: string): string {
    return this._oppsService.getContactNames(id)
  }

  viewOpps(oppsId: string) {
    this._router$$.navigate(['opportunities', oppsId])
  }

  openOppsDialog() {
    this._sbS.sink = this.dialog.open(AddNewOpportunityComponent, { data: this.activeCompany, panelClass: 'full-width-dialog' })
      .afterClosed().subscribe();
  }
}
