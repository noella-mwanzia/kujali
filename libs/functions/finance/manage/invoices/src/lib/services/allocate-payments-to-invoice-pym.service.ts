import { Logger, Repository } from '@iote/cqrs';
import { __DateToStorage } from '@iote/time';

import * as moment from 'moment';

import { round as __round } from 'lodash';

import { Payment } from '@app/model/finance/payments';
import { Invoice } from '@app/model/finance/invoices';
import { AllocateWithType, Allocation, PaymentAllocation, PaymentAllocationElement } from '@app/model/finance/allocations';

import { CALC_INV_TOTAL } from '@app/functions/finance/manage/common';

export class PaymentsToInvoiceP {

  constructor(private _logger: Logger) { }

  async createPaymentAllocation(payment: Payment, invoice: Invoice, allocs: Allocation[], payAllocsRepo: Repository<PaymentAllocation>): Promise<PaymentAllocation> {
    this._logger.log(() => `[AllocatePaymentsService].createPaymentAllocation: creating payment allocation for payment: ${payment.id}`);
    this._logger.log(() => `[AllocatePaymentsService].createPaymentAllocation: selected invoice:  ${invoice.id}`);

    // check if an allocation already exists for the invoice
    const payAlloc = await payAllocsRepo.getDocumentById(payment.id!);

    if (payAlloc) {
      this._logger.log(() => `[AllocatePaymentsService].createPaymentAllocation: payment allocation exists for payment: ${payment.id}`);
      payAlloc.elements.push(this.createPaymentAllocationElement(payment, invoice, allocs));
      payAlloc.amount = payment.amount;

      const allocStatus = this.calculatePaymentAllocatedAmount(payment, invoice, allocs, true, payAlloc);
      payAlloc.allocStatus = allocStatus.status;

      delete payAlloc.balance;
      delete payAlloc.credit;

      allocStatus.alloc!.credit ? payAlloc['credit'] = allocStatus.alloc!.credit : null;

      return payAlloc;
    } else {
      this._logger.log(() => `[AllocatePaymentsService].createPaymentAllocation: No payment allocation exists for payment: ${payment.id}`);

      const payElement: PaymentAllocationElement = this.createPaymentAllocationElement(payment, invoice, allocs);
      const payAmount = payment.amount;
      const allocStatus = this.calculatePaymentAllocatedAmount(payment, invoice, allocs, false);
      const alloc = allocs.find(alloc => alloc.invId === invoice.id && payment.id === alloc.pId)!;
      const payAllocation = this.createPaymentAllocationObj(payment, [payElement], allocStatus, payAmount, alloc);
  
      return payAllocation;
    }
  }

  createPaymentAllocationObj(payment: Payment, payElements: PaymentAllocationElement[], allocStatus, payAmount: number, alloc: Allocation) {
    this._logger.log(() => `[AllocatePaymentsService].createAllocation for non-existing payment:  ${payment.id} and ${alloc.invId} invoice`);

    const paymentAllocation: PaymentAllocation = {
      id: payment.id!,
      elements: payElements,
      allocStatus: allocStatus.status,
      amount: payAmount
    }

    allocStatus.alloc?.balance ? paymentAllocation.balance = allocStatus.alloc.balance : null;
    allocStatus.alloc?.credit ? paymentAllocation.credit = allocStatus.alloc.credit : null;

    return paymentAllocation;
  }

  createPaymentAllocationElement(payment: Payment, invoice: Invoice, allocs: Allocation[]): PaymentAllocationElement {
    this._logger.log(() => `[AllocatePaymentsService].createPaymentAllocationElement for:  ${payment.id} and ${invoice.id}`);

    const alloc = allocs.find(alloc => (alloc.invId === invoice.id && alloc.pId === payment.id))!;

    const paymentAllocationElement: PaymentAllocationElement = {
      allocId: alloc.id!,
      pId: payment.id!,
      withId: invoice.id!,
      withType: AllocateWithType.Invoice,
      note: payment.notes!,
      date: payment.date!,
      accId: payment.from,
      accName: payment.fromAccName,
      allocAmount: alloc.amount!,
      allocMode: 1,
      allocDate: __DateToStorage(moment())
    }

    return paymentAllocationElement;
  }

  calculatePaymentAllocatedAmount(payment: Payment, invoice: Invoice, allocs: Allocation[], payAllocExists: boolean, payAlloc?: PaymentAllocation) {
    this._logger.log(() => `[AllocatePaymentsService].calculateAllocatedAmount from payment(s):  ${payment.id} and ${invoice.id} invoice`);

    const alloc = allocs.find(alloc => alloc.pId === payment.id)!;
    const totalInvoiceAmount = CALC_INV_TOTAL(invoice);
    const allocAmount = payAllocExists ?  payAlloc?.balance! ? payAlloc?.balance! : payAlloc?.credit! : alloc.amount!;
    
    if (allocAmount >= totalInvoiceAmount) {
      return { status: 5, alloc: { credit: allocAmount - totalInvoiceAmount } };
    }
    if (allocAmount < payment.amount) {
      return { status: 5, alloc: { credit: payment.amount - allocAmount } };
    }
    return { status: 1 };
  }
}