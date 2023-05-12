import { round as __round } from 'lodash';

import { Logger, Repository } from '@iote/cqrs';

import { Payment } from '@app/model/finance/payments';
import { Invoice } from '@app/model/finance/invoices';
import { Allocation, PaymentAllocation } from '@app/model/finance/allocations';
import { PaymentAllocationElement } from '@app/model/finance/allocations';

export class InvoicesToPaymentP {

  constructor(private _logger: Logger) { }

  async createSinglePaymentAllocation(payment: Payment, invoices: Invoice[], alloc: Allocation[], paymentAllocsRepo: Repository<PaymentAllocation>) {

    this._logger.log(() => `[AllocatePaymentsService].createSinglePaymentAllocation: creating payment allocation for payment: ${payment.id}`);
    this._logger.log(() => `[AllocatePaymentsService].createSinglePaymentAllocation: selected invoices are :  ${invoices.length}`);

    let paymentElements: PaymentAllocationElement[] = invoices.map(invoice => this.createSinglePaymentAllocationElement(payment, invoice, alloc));

    // check if an allocation already exists for the payment
    const paymentAlloc = await paymentAllocsRepo.getDocumentById(payment.id!);

    if (paymentAlloc) {
      this._logger.log(() => `[AllocateInvoiceService].createSinglePaymentAllocation: Found an existing payment alloc :  ${paymentAlloc.id}`);

      const prevPaymentsAllocElements = paymentAlloc.elements;
      const newPaymentsAllocElements = paymentElements;

      const allocStatus = this.calculateSinglePaymentAllocatedAmount(payment, invoices, alloc, true, paymentAlloc);

      paymentAlloc.allocStatus = allocStatus.status;

      // remove previous allocation status
      delete paymentAlloc.balance;
      delete paymentAlloc.credit;

      allocStatus.alloc?.balance ? paymentAlloc['balance'] = allocStatus.alloc.balance : null;

      const allElements = [...prevPaymentsAllocElements, ...newPaymentsAllocElements];
      paymentAlloc.elements = allElements;

      return paymentAlloc;
    }

    const allocStatus = this.calculateSinglePaymentAllocatedAmount(payment, invoices, alloc, false);

    let paymentAllocation: PaymentAllocation = {
      id: payment.id!,
      elements: paymentElements,
      allocStatus: allocStatus.status,
      amount: payment.amount,
    }

    allocStatus.alloc?.balance ? paymentAllocation.balance = allocStatus.alloc.balance : null;

    return paymentAllocation;
  }

  createSinglePaymentAllocationElement(payment: Payment, invoice: Invoice, allocs: Allocation[]): PaymentAllocationElement {
    this._logger.log(() => `[AllocatePaymentsService].createPaymentAllocationElement for:  ${payment.id} and ${invoice.id}`);

    const alloc = allocs.find(alloc => alloc.invId === invoice.id)!;
    const allocAmount = __round(alloc?.amount ?? 0, 2);
    const allocId = alloc.id!;

    let paymentAllocationElement: PaymentAllocationElement = {
      allocId: allocId,
      pId: payment.id!,
      note: payment.notes!,
      date: payment.date!,
      accId: payment.from,
      accName: payment.fromAccName,
      allocAmount: allocAmount,
      invoiceId: invoice.id!,
      invoiceTitle: invoice.title!,
      allocMode: 1
    }

    return paymentAllocationElement;
  }

  calculateSinglePaymentAllocatedAmount(payment: Payment, invoices: Invoice[], allocs: Allocation[], allocExists: boolean, paymentAlloc?: PaymentAllocation) {
    this._logger.log(() => `[AllocatePaymentsService].calculateSinglePaymentAllocatedAmount for payment amount:  ${payment.amount} and ${invoices.length} invoices`);

    const paymentAmount = payment.amount;
    let allocsAmount = allocs.reduce((acc, alloc) => {
      return acc + alloc.amount!;
    }, 0);

    const totalAllocAmount = allocExists ? paymentAlloc?.balance! ? paymentAlloc?.balance! : paymentAlloc?.credit! : paymentAmount;

    if (allocsAmount < totalAllocAmount) {
      return {status: 5, alloc : {balance: totalAllocAmount - allocsAmount}}
    } else {
      return {status: 1};
    }
  }
}
