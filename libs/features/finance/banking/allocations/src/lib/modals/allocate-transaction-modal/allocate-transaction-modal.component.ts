import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { SubSink } from 'subsink';

import { combineLatest, map, tap } from 'rxjs';
import { round as __round } from 'lodash';

import { __DateFromStorage } from '@iote/time';

import { PaymentAllocation } from '@app/model/finance/allocations';
import { Invoice, InvoiceAllocation } from '@app/model/finance/invoices';

import { CALCULATE_INVOICE_TOTAL, InvoicesService } from '@app/state/finance/invoices';
import { AllocationsStateService } from '@app/state/finance/allocations';

@Component({
  selector: 'app-allocate-transaction-modal',
  templateUrl: './allocate-transaction-modal.component.html',
  styleUrls: ['./allocate-transaction-modal.component.scss'],
})
export class AllocateTransactionModalComponent implements OnInit {

  private _sbS = new SubSink();

  allInvoices: any[] = [];
  selectedInvoices: Invoice[] = [];

  allocating: boolean = false;

  alloctedAmount: number = 0;

  invoicesLoaded: boolean = false;

  constructor(private _dialog: MatDialog,
              private _invoices$$: InvoicesService,
              private _allocationsService: AllocationsStateService,
              @Inject(MAT_DIALOG_DATA) public payment: any
  ) {}

  ngOnInit(): void {
    const invoiceAllocs$ = this._allocationsService.getInvoicesAllocations();

    this._sbS.sink = combineLatest([invoiceAllocs$, this._invoices$$.getAllInvoices()])
                                  .pipe(
                                    map(([invAllocs, invoices]) => this.flatMapTransactionsAndPayments(invoices, invAllocs)),
                                    map((data) => data.filter((inv) => inv.allocStatus !== 1)),
                                    tap((data) => {this.allInvoices = data; this.invoicesLoaded = true}))
                                  .subscribe();
  }

  flatMapTransactionsAndPayments(invoices: Invoice[], invAllocs: InvoiceAllocation[]) {
    let invAndAllocs = invoices.map((inv) => {
      let invAlloc = invAllocs.find((invA) => invA.id === inv.id);
      return {...inv, ...invAlloc}
    })
    return invAndAllocs;
  }


  invoiceSelected(invoiceData: {checked: boolean, invoice: Invoice}) {
    if (invoiceData.checked) {
      this.selectedInvoices.push(invoiceData.invoice);
    } else {
      let inv = this.selectedInvoices.find((inv) => inv.id == invoiceData.invoice.id);
      this.selectedInvoices.splice(this.selectedInvoices.indexOf(inv!), 1);
    }
    this.calculateAllocatedAmount();
  }

  calculateAllocatedAmount() {
    this.alloctedAmount = this.selectedInvoices.reduce((acc, invoice) => {
      return acc + this.getTotalAmount(invoice);
    }, 0);
  }

  getTotalAmount(invoice: Invoice) {
    return __round(CALCULATE_INVOICE_TOTAL(invoice), 2);
  }

  getUnallocatedAmount(payment: PaymentAllocation, payAmnt: number): number {
    const amnt = payment.allocStatus == 5 ? payment.credit! - this.alloctedAmount: payAmnt - this.alloctedAmount;
    return amnt > 0 ? amnt : 0;
  }

  allocateTransaction() {
    this.allocating = true;
    this._allocationsService.allocateInvoices(this.payment, this.selectedInvoices)
                            .subscribe(() => this.completeAllocationActions());
  }

  completeAllocationActions() {
    this.allocating = false;
    this._dialog.closeAll();
  }
}
