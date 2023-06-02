import { round as __round } from 'lodash';

import * as moment from 'moment';

import { Logger, Repository } from '@iote/cqrs';
import { __DateToStorage } from '@iote/time';

import { Payment } from '@app/model/finance/payments';
import { Invoice } from '@app/model/finance/invoices';
import { AllocateWithType, Allocation } from '@app/model/finance/allocations';
import { InvoiceAllocation, InvoiceAllocationElement } from '@app/model/finance/invoices';

import { CALC_INV_TOTAL } from '@app/functions/finance/manage/common';

export class PaymentsToInvoiceI {

  constructor(private _logger: Logger) { }

  async createSingleInvoiceAllocation(payments: Payment[], invoice: Invoice, allocs: Allocation[], invoiceAllocsRepo: Repository<InvoiceAllocation>) {

    this._logger.log(() => `[AllocateInvoiceService].createInvoiceAllocation: creating invoice allocation for invoice: ${invoice.id}`);
    this._logger.log(() => `[AllocateInvoiceService].createInvoiceAllocation: selected payments are :  ${payments.length}`);

    const invoiceAmount = CALC_INV_TOTAL(invoice);
    let invoiceElements: InvoiceAllocationElement[] = payments.map(pay => this.createSingleInvoiceAllocationElement(pay, invoice, allocs));

    // check if an allocation already exists for the invoice
    const invoiceAlloc = await invoiceAllocsRepo.getDocumentById(invoice.id!);

    if (invoiceAlloc) {
      this._logger.log(() => `[AllocateInvoiceService].createInvoiceAllocation: Found an existing invoice alloc :  ${invoiceAlloc.id}`);

      const prevInvoiceAllocElements = invoiceAlloc.elements;
      const newInvoiceAllocElements = invoiceElements;

      const allocStatus = this.calculateSingleInvoiceAllocatedAmount(payments, invoice, allocs, true, invoiceAlloc);

      invoiceAlloc.allocStatus = allocStatus.status;

      // remove previous allocation status
      delete invoiceAlloc.balance;
      delete invoiceAlloc.credit;

      allocStatus.alloc?.balance ? invoiceAlloc['balance'] = allocStatus.alloc.balance : null;

      this._logger.log(() => `[AllocateInvoiceService].createInvoiceAllocation: Invoice Alloc Status :  ${JSON.stringify(allocStatus)}`);

      const allElements = [...prevInvoiceAllocElements, ...newInvoiceAllocElements];
      invoiceAlloc.elements = allElements;

      return invoiceAlloc;
    } else {
      this._logger.log(() => `[AllocateInvoiceService].createInvoiceAllocation: No existing invoice alloc Obj found`);

      const allocStatus = this.calculateSingleInvoiceAllocatedAmount(payments, invoice, allocs, false);

      let invoiceAllocation: InvoiceAllocation = {
        id: invoice.id!,
        elements: invoiceElements,
        allocStatus: allocStatus.status,
        to: invoice?.to ?? '',
        toAccName: invoice?.toAccName ?? '',
        amount: invoiceAmount,
        notes: invoice?.notes ?? '',
        from: invoice.from ?? '',
        fromAccName: invoice?.fromAccName ?? '',
        date: invoice.date,
      }
      
      allocStatus.alloc?.balance ? invoiceAllocation.balance = allocStatus.alloc.balance : null;
      return invoiceAllocation;
    }
  }

  createSingleInvoiceAllocationElement(payment: Payment, invoice: Invoice, allocs: Allocation[]): InvoiceAllocationElement {
    this._logger.log(() => `[AllocateInvoiceService].createInvoiceAllocationElement for:  ${invoice.id} and ${payment.id}`);

    const alloc = allocs.find(alloc => alloc.pId === payment.id);
    const allocAmount = __round(alloc?.amount ?? 0, 2);
    const allocId = alloc?.id ?? '';

    let invoiceAllocationElement: InvoiceAllocationElement = {
      allocId: allocId,
      invId: invoice.id!,
      withId: payment.id!,
      withType: AllocateWithType.Payment,
      accId: payment.from,
      accName: payment.fromAccName,
      notes: payment.notes! ?? '',
      allocDate: __DateToStorage(moment()),
      paymentDate: payment.date!,
      allocAmount: allocAmount!,
      allocMode: 1
    }

    return invoiceAllocationElement;
  }

  calculateSingleInvoiceAllocatedAmount(payments: Payment[], invoice: Invoice, allocs: Allocation[], allocExists: boolean, invoiceAlloc?: InvoiceAllocation) {
    this._logger.log(() => `[AllocateInvoiceService].calculateSingleInvoiceAllocatedAmount for invoice:  ${invoice.id} and ${payments.length} payments`);

    const invoiceAmount = CALC_INV_TOTAL(invoice);
    const allocAmount = allocs.reduce((acc, alloc) => {
      return acc + alloc.amount!;
    }, 0);

    const totalAllocAmount = allocExists ? invoiceAlloc?.balance! ? invoiceAlloc?.balance! : invoiceAlloc?.credit! : invoiceAmount;

    if (allocAmount < totalAllocAmount) {
      return {status: 5, alloc : {balance: totalAllocAmount - allocAmount}}
    } else {
      return {status: 1};
    }
  }
}
