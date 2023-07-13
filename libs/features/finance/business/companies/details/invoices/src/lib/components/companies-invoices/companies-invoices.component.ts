import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';

import { SubSink } from 'subsink';

import { combineLatest } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import { round as __round } from 'lodash';

import { __DateFromStorage } from '@iote/time';

import { Company } from '@app/model/finance/companies';
import { Invoice } from '@app/model/finance/invoices';
import { AppClaimDomains } from '@app/model/access-control';

import { ActiveCompanyStore } from '@app/state/finance/companies';
import { OpportunitiesService } from '@app/state/finance/opportunities';
import { KujaliUsersService } from '@app/state/user';
import { InvoicesService } from '@app/state/finance/invoices';

const DATA: Invoice[] = [];

@Component({
  selector: 'companies-invoices',
  templateUrl: './companies-invoices.component.html',
  styleUrls: ['./companies-invoices.component.scss']
})
export class CompaniesInvoicesComponent implements OnInit {
  private _sbS = new SubSink();
  
  @Input() canViewInvoices: boolean;

  @Output() invoicesListLenEvent = new EventEmitter();

  displayedColumns: string[] = ['number', 'amount', 'date', 'dueDate', 'contact', 'status'];
  dataSource = new MatTableDataSource(DATA);

  activeCompany: Company;

  readonly CAN_CREATE_INVOICES = AppClaimDomains.InvCreate;

  constructor(private _router$$: Router,
              private router: ActivatedRoute,
              private _company$$: ActiveCompanyStore,
              private _invoicesService: InvoicesService,
              private _oppsService: OpportunitiesService,
              private _kujaliUserService: KujaliUsersService
  ) { }

  ngOnInit(): void {
    this.getPageData();
  }

  getPageData() {
    this._sbS.sink = combineLatest(([this._company$$.get(), this._invoicesService.getAllInvoices()]))
    .pipe(
      filter(([company, invoices]) => !!company && !!invoices),
      tap(([company, invoices]) => { this.activeCompany = company }))

    .subscribe(([company, invoices]) => {
      this.dataSource.data = invoices
        .filter((invoices) => { return invoices.customer ? invoices.customer == this.activeCompany.id : null })

      this.getInvoicesLen(this.dataSource.data.length.toString())
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

  getContactName(id: string): string {
    return this._oppsService.getContactNames(id)
  }

  viewInvoices(invoicesId: string) {
    this._router$$.navigate(['invoices', invoicesId, 'edit']);
  }

  createNewInvoice() {
    this._router$$.navigateByUrl('invoices/create', {state: {page: 'companies', data: this.activeCompany}});
  }
}
