import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { SubSink } from 'subsink';
import { combineLatest } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import { Contact } from '@app/model/finance/contacts';
import { Company } from '@app/model/finance/companies';
import { AppClaimDomains } from '@app/model/access-control';

import { ActiveCompanyStore } from '@app/state/finance/companies';
import { ContactsStore } from '@app/state/finance/contacts';

import { AddNewContactFormComponent } from '@app/features/finance/business/contacts/create';

const DATA: Contact[] = []

@Component({
  selector: 'companies-contacts',
  templateUrl: './companies-contacts.component.html',
  styleUrls: ['./companies-contacts.component.scss']
})
export class CompaniesContactsComponent implements OnInit, OnDestroy {

  private _sbS = new SubSink();

  @Input() canViewContacts: boolean;
  
  displayedColumns: string[] = ['imageurl', 'fullName', 'phone', 'email', 'roles', 'tags'];
  dataSource = new MatTableDataSource(DATA);

  contactsList: Contact[];
  activeCompany: Company;

  @Output() contactListLenEvent = new EventEmitter();

  readonly CAN_CREATE_CONTACTS = AppClaimDomains.ContactCreate;

  constructor(public dialog: MatDialog,
              private _contacts$$: ContactsStore,
              private _company$$: ActiveCompanyStore,
              private router: Router
  ) { }

  ngAfterViewInit() {
  }

  ngOnInit(): void {
    this._sbS.sink = combineLatest(([this._company$$.get(), this._contacts$$.get()]))
      .pipe(
        filter(([c, v]) => !!c && !!v),
        tap(([c, v]) => this.activeCompany = c))

      .subscribe(([c, v]) => {
        this.dataSource.data = v
          .filter((cs) => { return cs.company ? cs.company == this.activeCompany.id : null })
          .map((c) => ({ ...c, fullName: `${c.fName} ${c.lName} ` }));

        this.emitContactLen(this.dataSource.data.length.toString());
      })
  }

  viewContact(id: string) {
    this.router.navigate(['/contacts', id])
  }

  openContactDialog() {
    this._sbS.sink = this.dialog.open(AddNewContactFormComponent, { data: this.activeCompany, panelClass: 'full-width-dialog' })
      .afterClosed().subscribe();
  }

  emitContactLen(value: string) {
    this.contactListLenEvent.emit(value)
  }

  ngOnDestroy = () => this._sbS.unsubscribe();

}
