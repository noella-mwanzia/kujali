import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

import { Observable, switchMap, tap } from 'rxjs';

import { Payment } from '@app/model/finance/payments';
import { Invoice, InvoiceAllocation } from '@app/model/finance/invoices';
import { Allocation, PaymentAllocation } from '@app/model/finance/allocations';

import { ActiveOrgStore } from '@app/state/organisation';

import { PaymentsAllocationsStore } from '../stores/payments-allocations.store';
import { InvoicesAllocationsStore } from '../stores/invoices-allocations.store';

import { REDUCE_INVOICE_ALLOC_AMOUNT, REDUCE_PAYMENT_ALLOC_AMOUNT } from '../providers/invoice-alloc-amount-reducer.function';


@Injectable({
  providedIn: 'root'
})
export class AllocationsStateService {

  constructor(private _aFF$$: AngularFireFunctions,
              private _activeOrg$$: ActiveOrgStore,
              private _paymentsAllocations$$: PaymentsAllocationsStore,
              private _invoicesAllocations$$: InvoicesAllocationsStore)
  { }

  getPaymentAllocations(): Observable<PaymentAllocation[]> {
    return this._paymentsAllocations$$.get();
  }

  getInvoicesAllocations(): Observable<InvoiceAllocation[]> {
    return this._invoicesAllocations$$.get();
  }

  getOrg(){
    return this._activeOrg$$.get();
  }

  allocateInvoices(payment: Payment, invoices: Invoice[]) {
    return this.getOrg().pipe(
                              switchMap((org) => this.perfomInvoicesAllocationActions(org.id!, payment, invoices, 'allocateInvoicesToPayment')))
  }

  allocatePayments(payments: Payment[], invoice: Invoice) {
    return this.getOrg().pipe(
                              switchMap((org) => this.perfomPaymentsAllocationActions(org.id!, payments, invoice, 'allocatePaymentsToInvoice')))
  }

  perfomInvoicesAllocationActions(orgId: string, payment: Payment, invoices: Invoice[], allocFunction: string) {
    const allocsData = REDUCE_INVOICE_ALLOC_AMOUNT(payment, invoices);
    return this.doAllocation(orgId, allocsData, allocFunction);
  }

  perfomPaymentsAllocationActions(orgId: string, payments: Payment[], invoice: Invoice, allocFunction: string) {
    const allocsData = REDUCE_PAYMENT_ALLOC_AMOUNT(payments, invoice);
    return this.doAllocation(orgId, allocsData, allocFunction);
  }

  doAllocation(orgId: string, allocsData, allocFunction: string) {
    return this._aFF$$.httpsCallable('doAllocations')({orgId: orgId, allocs: allocsData})
                          .pipe(
                            tap((data) => {console.log(data)}),
                            switchMap((all) => this._aFF$$.httpsCallable(allocFunction)({orgId: orgId, allocs: all})),
                            tap((data) => {console.log(data)}));
  }

  deAllocate(allocs: Allocation[], deAllocDomain: string) {
    return this.getOrg().pipe(
                              switchMap((org) => this._aFF$$.httpsCallable('deAllocate')({orgId: org.id, allocs: allocs, deAlloc: deAllocDomain})))
  }
}

