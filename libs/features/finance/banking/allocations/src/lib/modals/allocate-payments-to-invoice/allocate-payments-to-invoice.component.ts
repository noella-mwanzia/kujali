import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { SubSink } from 'subsink';
import { combineLatest, map, Observable, tap, filter } from 'rxjs';
import { merge as __merge } from 'lodash';

import { FAccount } from '@app/model/finance/accounts/main';
import { Organisation } from '@app/model/organisation';
import { BankTransaction, Payment } from '@app/model/finance/payments';
import { PaymentAllocation } from '@app/model/finance/allocations';
import { Invoice, InvoiceAllocation } from '@app/model/finance/invoices';

import { PaymentsStateService } from '@app/state/finance/payments';
import { AllocationsStateService } from '@app/state/finance/allocations';
import { CALCULATE_INVOICE_TOTAL } from '@app/state/finance/invoices';

@Component({
  selector: 'app-allocate-payments-to-invoice',
  templateUrl: './allocate-payments-to-invoice.component.html',
  styleUrls: ['./allocate-payments-to-invoice.component.scss'],
})
export class AllocatePaymentsToInvoiceComponent {

  private _sbS = new SubSink();

  startPontoOnboarding = false;

  org: Organisation;

  isLoading: boolean = false;
  redirectUrl: string = '';

  accounts$: Observable<FAccount[]>;

  showFilter: boolean = false;

  allPayments: Payment[] = [];
  selectedPayments: Payment[] = [];
  paymentsLoaded: boolean = false;

  allocating: boolean = false;

  alloctedAmount: number = 0;
  totalInvoiceAmount: number = 0;

  constructor(private _dialog: MatDialog,
              private _paymentsService: PaymentsStateService,
              private _allocsService: AllocationsStateService,
              @Inject(MAT_DIALOG_DATA) public invoice: Invoice
  ) { }

  ngOnInit(): void {
    this.totalInvoiceAmount = CALCULATE_INVOICE_TOTAL(this.invoice);

    this._sbS.sink = combineLatest([this._paymentsService.getAllPayments(),
                                    this._allocsService.getPaymentAllocations()])
                        .pipe(
                          filter(([trs, pAllocs]) => !!trs && !!pAllocs),
                          map(([trs, pAllocs]) => this.flatMapTransactionsAndPayments(trs, pAllocs)),
                          tap((data) => { this.allPayments = data }),
                          tap(() => this.paymentsLoaded = true))
                        .subscribe();
  }

  flatMapTransactionsAndPayments(trs: BankTransaction[], pAllocs: PaymentAllocation[]) {
    let trsAndPayments = trs.map((tr) => {
      const paymentAlloc = pAllocs.find((p) => p.id === tr.id);
      return __merge(tr, paymentAlloc);
    })

    return trsAndPayments;
  }

  paymentSelected(paymentData: {checked: boolean, payment: Payment}) {
    if (paymentData.checked) {
      this.selectedPayments.push(paymentData.payment);
    } else {
      let removedPayment = this.selectedPayments.find((paym) => paym.id == paymentData.payment.id);
      this.selectedPayments.splice(this.selectedPayments.indexOf(removedPayment!), 1);
    }
    this.calculateAllocatedAmount();
  }

  calculateAllocatedAmount() {
    this.alloctedAmount = this.selectedPayments.reduce((acc, payment) => {
      return acc + payment.amount;
    }, 0);
  }

  getUnallocatedAmount(invoice: InvoiceAllocation, payAmnt: number): number {
    const amnt = invoice.allocStatus == 5 ? invoice.credit! - this.alloctedAmount: payAmnt - this.alloctedAmount;
    return amnt > 0 ? amnt : 0;
  }

  allocateInvoieToTransaction() {
    this.allocating = true;    
    this._allocsService.allocatePayments(this.selectedPayments, this.invoice)
                            .subscribe(() => this.completeAllocationActions());
  }

  completeAllocationActions() {
    this.allocating = false;
    this._dialog.closeAll();
  }
}
