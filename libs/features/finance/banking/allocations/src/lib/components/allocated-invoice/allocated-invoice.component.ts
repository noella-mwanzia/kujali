import { Component, Input, OnInit } from '@angular/core';

import { Payment } from '@app/model/finance/payments';
import { Allocation } from '@app/model/finance/allocations';
import { AllocationsStateService } from '@app/state/finance/allocations';
import { Invoice, InvoiceAllocationElement } from '@app/model/finance/invoices';

@Component({
  selector: 'app-allocated-invoice',
  templateUrl: './allocated-invoice.component.html',
  styleUrls: ['./allocated-invoice.component.scss'],
})
export class AllocatedInvoiceComponent implements OnInit {

  @Input() payments: Payment[] = [];
  @Input() invoice: Invoice;

  invAllocElements: InvoiceAllocationElement[] = [];
  selectedPayments: Payment[] = [];

  deAllocating = false;

  constructor(private allocsService: AllocationsStateService) { }

  ngOnInit(): void {
    if (this.payments) {
      this.invAllocElements = this.invoice.elements;
      const elemntIds = this.invAllocElements.map((allocElement: InvoiceAllocationElement) => allocElement.withId);      
      this.payments = this.payments.filter((payment) => elemntIds.includes(payment.id!));
    }
  }

  paymentSelected(paymentData: { checked: boolean, payment: Payment }) {
    if (paymentData.checked) {
      this.selectedPayments.push(paymentData.payment);
    } else {
      let removedPayment = this.selectedPayments.find((paym) => paym.id == paymentData.payment.id);
      this.selectedPayments.splice(this.selectedPayments.indexOf(removedPayment!), 1);
    }
  }

  createDeallocations() {
    const deallocsid = this.selectedPayments.map((payment) => payment.id);
    const deallocs = this.invAllocElements.filter((allocElement) => deallocsid.includes(allocElement.withId));
    return deallocs.map((d) => this.createDeallocElement(d));
  }

  createDeallocElement(allocElement: InvoiceAllocationElement) {
    return {
      pId: allocElement.withId,
      invId: this.invoice.id,
      amount: allocElement.allocAmount,
    }
  }

  deAllocateInvoice() {
    this.deAllocating = true;
    const allocs = this.createDeallocations() as Allocation[];
    this.allocsService.deAllocate(allocs, 'payments').subscribe((res) => this.deAllocating = false);
  }
}
