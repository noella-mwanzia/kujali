import { Logger, Repository } from '@iote/cqrs';

import { round as __round } from 'lodash';

import { Payment } from '@app/model/finance/payments';
import { Allocation } from '@app/model/finance/allocations';
import { Invoice, InvoiceAllocation, InvoiceAllocationElement } from '@app/model/finance/invoices';

import { CALC_INV_TOTAL } from '../providers/calculate-invoice-total.function';

export class InvoicesToPaymentI {

  constructor(private _logger: Logger) { }

  async createInvoiceAllocation(payment: Payment, invoice: Invoice, allocs: Allocation[], invAllocsRepo: Repository<InvoiceAllocation>): Promise<InvoiceAllocation> {
    this._logger.log(() => `[AllocateInvoicesService].createInvoiceAllocation: creating invoice allocation for invoice: ${invoice.id}`);
    this._logger.log(() => `[AllocateInvoicesService].createInvoiceAllocation: selected payment:  ${payment.id}`);

    // check if an allocation already exists for the invoice
    const invAlloc = await invAllocsRepo.getDocumentById(invoice.id!);

    if (invAlloc) {
      this._logger.log(() => `[AllocateInvoicesService].createInvoiceAllocation: invoice allocation exists for invoice: ${invoice.id}`);
      invAlloc.elements.push(this.createInvoiceAllocationElement(payment, invoice, allocs));
      invAlloc.amount = this.calculateInvoiceAmount(invoice);

      const allocStatus = this.calculateInvoiceAllocatedAmount(payment, invoice, allocs, true, invAlloc);
      invAlloc.allocStatus = allocStatus.status;

      // invAlloc?.balance ? invAlloc.balance = allocStatus.alloc!.balance : null;
      invAlloc?.credit ? invAlloc.credit = allocStatus.alloc!.credit : null;

      return invAlloc;
    } else {

      const invoiceElement: InvoiceAllocationElement = this.createInvoiceAllocationElement(payment, invoice, allocs);
      const invAmount = this.calculateInvoiceAmount(invoice);
      const allocStatus = this.calculateInvoiceAllocatedAmount(payment, invoice, allocs, false);
      const alloc = allocs.find(alloc => alloc.invId === invoice.id)!;
      const invoiceAllocation = this.createInvoiceAllocationObj(invoice, [invoiceElement], allocStatus, invAmount, alloc);
  
      return invoiceAllocation;
    }
  }

  createInvoiceAllocationObj(invoice: Invoice, invoiceElement: InvoiceAllocationElement[], allocStatus, invAmount: number, alloc: Allocation) {
    this._logger.log(() => `[AllocateInvoicesService].createAllocation for existing invoice:  ${invoice.id} and ${alloc.pId} payment`);

    const invoiceAllocation: InvoiceAllocation = {
      id: invoice.id!,
      elements: invoiceElement,
      allocStatus: allocStatus.status,
      to: invoice?.to ?? '',
      toAccName: invoice?.toAccName ?? '',
      amount: invAmount,
      notes: invoice?.notes ?? '',
      from: invoice.from ?? '',
      fromAccName: invoice?.fromAccName ?? '',
      date: invoice.date,
    }

    allocStatus.alloc?.balance ? invoiceAllocation.balance = allocStatus.alloc.balance : null;
    allocStatus.alloc?.credit ? invoiceAllocation.credit = allocStatus.alloc.credit : null;

    return invoiceAllocation;
  }

  createInvoiceAllocationElement(payment: Payment, invoice: Invoice, allocs: Allocation[]): InvoiceAllocationElement {
    this._logger.log(() => `[AllocateInvoicesService].createInvoiceAllocationElement for:  ${payment.id} and ${invoice.id}`);

    const alloc = allocs.find(alloc => alloc.invId === invoice.id)!;

    const paymentAllocationElement: InvoiceAllocationElement = {
      invId: invoice.id!,
      pId: payment.id!,
      allocType: 1,
      accId: payment.from,
      accName: payment.fromAccName,
      notes: payment.notes! ?? '',
      date: payment.date!,
      allocAmount: alloc.amount!,
      allocMode: 1,
      allocId: alloc.id!
    }

    return paymentAllocationElement;
  }

  calculateInvoiceAmount (invoice: Invoice): number {
    return CALC_INV_TOTAL(invoice);
  }

  calculateInvoiceAllocatedAmount(payment: Payment, invoice: Invoice, allocs: Allocation[], invAllocExists: boolean, invAlloc?: InvoiceAllocation) {
    this._logger.log(() => `[AllocateInvoicesService].calculateAllocatedAmount from payment(s):  ${payment.id} and ${invoice.id} invoice`);

    const alloc = allocs.find(alloc => (alloc.invId === invoice.id && alloc.pId === alloc.pId))!;

    const totalPaymentsAmount = payment.amount;

    const invAmount = CALC_INV_TOTAL(invoice);

    const allocAmount = invAllocExists ? invAlloc?.balance! ? invAlloc?.balance! : invAlloc?.credit! : alloc.amount!;
    
    if (allocAmount >= totalPaymentsAmount) {
      return { status: 5, alloc: { credit: allocAmount - totalPaymentsAmount } };
    }
    if (allocAmount < invAmount) {
      return { status: 5, alloc: { credit: invAmount - allocAmount } };
    }
    return { status: 1 };
  }
}