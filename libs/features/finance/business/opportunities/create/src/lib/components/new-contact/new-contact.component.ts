import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { SubSink } from 'subsink';

import { combineLatest, Observable } from 'rxjs';

import { sortBy as __sortyBy } from 'lodash';

import { AppClaimDomains } from '@app/model/access-control';
import { Contact } from '@app/model/finance/contacts';

import { ContactsStore } from '@app/state/finance/contacts';

@Component({
  selector: 'new-contact',
  templateUrl: './new-contact.component.html',
  styleUrls: ['./new-contact.component.scss'],
})
export class NewContactComponent implements OnInit {
  private _sbS = new SubSink();

  @Input() contactFormGroup: FormGroup;
  @Input() activeCompany$: Observable<any>;

  contactList: Contact[];
  filteredContacts: any;

  showContact: boolean;
  isContactFilled: boolean;

  private _page: string;

  readonly CAN_CREATE_CONTACTS = AppClaimDomains.ContactCreate;

  constructor(private _router$$: Router, private _contacts$$: ContactsStore) {}

  ngOnInit(): void {
    this._page = this._router$$.url.split('/')[1];

    this._page == 'contacts' ? (this.isContactFilled = true) : false;

    this.getContacts();
    this.companyChanged();
  }

  companyChanged() {
    if (this._page) {
      this._sbS.sink = combineLatest([this.activeCompany$, this._contacts$$.get(),
      ]).subscribe(([company, contact]) => {
        company = company.id ? company.id : company;
        this.contactList = __sortyBy(contact, ['fName'])
          .filter((contact) => {
            return contact ? company ? contact.company == company : [] : null;
          })
          .map((c) => ({ ...c, fullName: `${c.fName} ${c.lName}` }));

        this.filteredContacts = this.contactList.slice();
      });
    }
  }

  getContacts() {
    this._sbS.sink = this._contacts$$.get().subscribe((contact) => {
      contact = __sortyBy(contact, ['fName']);
      this.contactList = contact.map((c) => ({
        ...c,
        fullName: `${c.fName} ${c.lName}`,
      }));
      this.filteredContacts = this.contactList.slice();
    });
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1 === c2.id : c1 === c2.id;
  }

  displayContactFn(contact: Contact): string {
    return contact && contact.fName ? contact.fName + ' ' + contact.lName : '';
  }

  toggleContact = () => (this.showContact = !this.showContact);
}
