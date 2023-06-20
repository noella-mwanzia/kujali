import { Component, Input } from '@angular/core';

import { Invoice } from '@app/model/finance/invoices';
import { Allocation, PaymentAllocation, PaymentAllocationElement } from '@app/model/finance/allocations';

import { AllocationsStateService } from '@app/state/finance/allocations';

@Component({
  selector: 'app-allocated-payment',
  templateUrl: './allocated-payment.component.html',
  styleUrls: ['./allocated-payment.component.scss'],
})
export class AllocatedPaymentComponent {

  @Input() invoices: Invoice[] = [];
  @Input() payment: PaymentAllocation;

  payAllocElements: PaymentAllocationElement[] = [];
  selectedInvoices: Invoice[] = [];

  deAllocating = false;

  constructor(private allocsService: AllocationsStateService) { }

  ngOnInit(): void {
    this.payAllocElements = this.payment.elements;    
    const elemntIds = this.payAllocElements.map((allocElement: PaymentAllocationElement) => allocElement.withId);    
    this.invoices = this.invoices.filter((invoice) => elemntIds.includes(invoice.id!));
  }

  invoicesSelected(invoicesData: { checked: boolean, invoice: Invoice }) {
    if (invoicesData.checked) {
      this.selectedInvoices.push(invoicesData.invoice);
    } else {
      let removedInvoice = this.selectedInvoices.find((inv) => inv.id == invoicesData.invoice.id);
      this.selectedInvoices.splice(this.selectedInvoices.indexOf(removedInvoice!), 1);
    }
  }

  createDeallocations() {
    const deallocsid = this.selectedInvoices.map((invoice) => invoice.id);
    const deallocs = this.payAllocElements.filter((allocElement) => deallocsid.includes(allocElement.withId));
    return deallocs.map((d) => this.createDeallocElement(d));
  }

  createDeallocElement(allocElement: PaymentAllocationElement) {
    return {
      pId: this.payment.id,
      invId: allocElement.withId,
      amount: allocElement.allocAmount,
    }
  }

  deAllocatePayment() {
    this.deAllocating = true;
    const allocs = this.createDeallocations() as Allocation[];
    this.allocsService.deAllocate(allocs, 'invoices').subscribe((res) => this.deAllocating = false);
  }
}
