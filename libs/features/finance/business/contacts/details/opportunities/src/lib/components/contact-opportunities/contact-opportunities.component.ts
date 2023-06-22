import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { SubSink } from 'subsink';

import { combineLatest } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import { __DateFromStorage } from '@iote/time';

import { Opportunity } from '@app/model/finance/opportunities'
import { Contact } from '@app/model/finance/contacts';

import { AppClaimDomains } from '@app/model/access-control';

import { OpportunitiesService, OpportunitiesStore } from '@app/state/finance/opportunities'
import { ActiveContactStore } from '@app/state/finance/contacts'
import { KujaliUsersService } from '@app/state/user';

import { AddNewOpportunityComponent } from '@app/features/finance/business/opportunities/create';

const DATA: Opportunity[] = []

@Component({
  selector: 'contact-opportunities',
  templateUrl: './contact-opportunities.component.html',
  styleUrls: ['./contact-opportunities.component.scss']
})
export class ContactOpportunitiesComponent implements OnInit {

  private _sbS = new SubSink();

  @Input() canViewOpps: boolean;

  @Output() oppsLenEvent = new EventEmitter();

  displayedColumns: string[] = ['title', 'assigned-to', 'company', 'deadline', 'status', 'tags'];
  dataSource = new MatTableDataSource(DATA);

  activeContact: Contact;
  oppsLen: string;

  readonly CAN_CREATE_OPPS = AppClaimDomains.OppsCreate;

  constructor(private dialog: MatDialog,
              private _router$$: Router,
              private _contact$$: ActiveContactStore,
              private _opps$$: OpportunitiesStore,
              private _oppsService: OpportunitiesService,
              private _kujaliUserService: KujaliUsersService
  ) { }

  ngOnInit(): void {
    this.getPageData();
  }

  getPageData () {
    this._sbS.sink = combineLatest(([this._contact$$.get(), this._opps$$.get()]))
    .pipe(
      filter(([c, v]) => (!!c && !!v)),
      tap(([c, v]) => {
        this.activeContact = c 
      }))
    .subscribe(([c, v]) => {
      this.dataSource.data = v
        .filter((cs) => { return cs.contact ? cs.contact == this.activeContact?.id : null })

      this.oppsLenEmitter(this.dataSource.data.length.toString())
    })
  }

  getAssignedTo(assigned : string[]) : string[] {
    let users : any = this._kujaliUserService.getOrgUsers(assigned);
    return users;
  }

  getDate(date) {
    return __DateFromStorage(date).format("DD/MM/YYYY")
  }

  oppsLenEmitter(value: string) {
    this.oppsLenEvent.emit(value);
  }

  getCompanyName(id: string): string {
    return this._oppsService.getCompanyNames(id)
  }

  openOppsDialog() {
    this._sbS.sink = this.dialog.open(AddNewOpportunityComponent, { data: this.activeContact, width: '800px' })
      .afterClosed().subscribe();
  }

  viewOpps(oppsId: string) {
    this._router$$.navigate(['opportunities', oppsId])
  }
}
