import { HandlerTools } from "@iote/cqrs";

import { InvoiceAllocation } from "@app/model/finance/invoices";
import { PaymentAllocation } from "@app/model/finance/allocations";

export function REMOVE_ALLOC_ELEMENT(payment: PaymentAllocation, invoice: InvoiceAllocation, tools: HandlerTools) {
  tools.Logger.log(() => `[removeAllocElement]: starting dealocation for: ${payment.id} && ${invoice.id}`);

  // step 1: remove alloc from invoice
  const payAlloc = invoice.elements.find((alloc) => alloc.pId == payment.id);
  if (payAlloc) {
    invoice.elements.splice(invoice.elements.indexOf(payAlloc), 1);
  }

  // step 2: remove alloc from payment
  const invAlloc = payment.elements.find((alloc) => alloc.invoiceId == invoice.id);
  if (invAlloc) {
    payment.amount -= invAlloc.allocAmount;
    payment.allocStatus = 5;
    payment.elements.splice(payment.elements.indexOf(invAlloc), 1);
  }

  return { payment, invoice };
}