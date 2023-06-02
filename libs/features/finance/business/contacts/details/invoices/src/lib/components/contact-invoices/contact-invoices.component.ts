import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';

import { SubSink } from 'subsink';

import { combineLatest } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import { round as __round } from 'lodash';

import { __DateFromStorage } from '@iote/time';

import { Contact } from '@app/model/finance/contacts';
import { Invoice } from '@app/model/finance/invoices';
// import { AppClaimDomains } from '@app/model/access-control';
import { Company } from '@app/model/finance/companies';

import { OpportunitiesService } from '@app/state/finance/opportunities';
import { KujaliUsersService } from '@app/state/user';
import { InvoicesService } from '@app/state/finance/invoices';
import { ActiveContactStore } from '@app/state/finance/contacts';
import { CompaniesStore } from '@app/state/finance/companies';

const DATA: Invoice[] = [];

@Component({
  selector: 'contact-invoices',
  templateUrl: './contact-invoices.component.html',
  styleUrls: ['./contact-invoices.component.scss']
})
export class ContactInvoicesComponent implements OnInit {
  private _sbS = new SubSink();

  @Input() canViewInvoices: boolean;
  
  @Output() invoicesListLenEvent = new EventEmitter();

  displayedColumns: string[] = ['number', 'amount', 'date', 'dueDate', 'company', 'status'];
  dataSource = new MatTableDataSource(DATA);

  activeContact: Contact;
  company: Company;

  // readonly CAN_CREATE_INVOICES = AppClaimDomains.InvCreate;

  constructor(private _router$$: Router,
              private _contact$$: ActiveContactStore,
              private _companies$$: CompaniesStore,
              private _invoicesService: InvoicesService,
              private _oppsService: OpportunitiesService,
              private _kujaliUserService: KujaliUsersService
  ) { }

  ngOnInit(): void {
    this.getPageData();
  }

  getPageData() {
    this._sbS.sink = combineLatest(([ this._contact$$.get(), this._invoicesService.getAllInvoices(),
                                      this._companies$$.get()]))
    .pipe(
      filter(([contact, invoices, companies]) => !!contact && !!invoices && !!companies),
      tap(([contact, invoices, companies]) => { 
        this.activeContact = contact;
        this.company = companies.find((co) => co.id == this.activeContact.company)! ?? '';
      }))
    .subscribe(([contact, invoices]) => {
      this.dataSource.data = invoices
        .filter((invoices) => { return invoices.contact ? invoices.contact == this.activeContact.id : null });

      this.getInvoicesLen(this.dataSource.data.length.toString());
    })
  }

  getTotalAmount(products: any) {
    let totals: any = products.map((order) => {        
      const total =
      order.cost * order.qty - (order.cost * order.qty * order.discount) / 100;
      return {
        totalSum: total,
        vat: total * (order.vat / 100),
      };
    });

    var totalResult = totals.reduce(function (order: any, value: any) {
      return order + value.totalSum + value.vat;
    }, 0);

    return __round(totalResult, 2);
  }

  getInvoicesLen(value: string) {
    this.invoicesListLenEvent.emit(value)
  }

  getAssignedTo(assigned : string[]) : string[] {
    let users : any = this._kujaliUserService.getOrgUsers(assigned);
    return users;
  }

  getDate(date) {
    return __DateFromStorage(date).format("DD/MM/YYYY")
  }

  getCompanyName(id: string): string {
    return this._oppsService.getCompanyNames(id)
  }

  viewInvoices(invoicesId: string) {
    this._router$$.navigate(['invoices', invoicesId, 'edit']);
  }

  createNewInvoice() {
    this._router$$.navigateByUrl('invoices/create', {state: {page: 'contacts', data: {contact :this.activeContact, company: this.company}}});
  }
}
