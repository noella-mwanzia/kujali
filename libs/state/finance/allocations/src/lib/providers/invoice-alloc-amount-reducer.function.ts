import { AllocateWithType, Allocation } from "@app/model/finance/allocations";
import { Invoice } from "@app/model/finance/invoices";
import { Payment } from "@app/model/finance/payments";

import { CALC_INV_TOTAL } from "./calculate-invoice-totals.function";

export function REDUCE_INVOICE_ALLOC_AMOUNT(payment: any, invoices: Invoice[]): Allocation[] {
  const paymentAmount = payment.amount;
  let payAllocAmount = payment.allocStatus === 5 ? payment.balance ? payment.balance : payment.credit! : paymentAmount;

  return invoices.map((invoice) => {
    const invoiceAmount = CALC_INV_TOTAL(invoice)
    let allocs = {
      pId: payment.id!,
      invId: invoice.id!,
      trType: AllocateWithType.Invoice,
      amount: payAllocAmount > invoiceAmount ? invoiceAmount : payAllocAmount,
    }
    payAllocAmount -= allocs.amount;
    return allocs;
  })
}

export function REDUCE_PAYMENT_ALLOC_AMOUNT(payments: Payment[], invoice: Invoice) {
  const invoiceAmount = CALC_INV_TOTAL(invoice);
  let invAllocAmount = invoice.allocStatus === 5 ? invoice.balance ? invoice.balance : invoice.credit! : invoiceAmount;

  return payments.map((payment) => {
    const paymentAmount = payment.amount;
    let allocs = {
      pId: payment.id!,
      invId: invoice.id!,
      trType: AllocateWithType.Payment,
      amount: invAllocAmount > paymentAmount ? paymentAmount : invAllocAmount,
    }
    invAllocAmount -= allocs.amount;
    return allocs;
  })
}

