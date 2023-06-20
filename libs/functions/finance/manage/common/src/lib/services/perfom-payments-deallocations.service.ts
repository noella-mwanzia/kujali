import { HandlerTools } from "@iote/cqrs";
import { Query } from '@ngfi/firestore-qbuilder';

import { InvoiceAllocation } from "@app/model/finance/invoices";
import { Allocation, PaymentAllocation } from "@app/model/finance/allocations";

import { RESOLVE_BALANCE } from "../providers/resolve-balance.function";
import { REMOVE_ALLOC_ELEMENT } from "../providers/remove-alloc-element.function";

export class PerfomPaymentsDeAllocation {

  constructor() { }

  async perfomPaymentsDeAllocation(orgId: string, alloc: Allocation[], payments: string[], tools: HandlerTools) {
    tools.Logger.log(() => `[perfomPaymentsDeAllocation]: starting deallocation for: ${alloc[0].invId} && ${payments.length}`);

    const INVOICE_ALLOCS_REPO = (orgId: string) => `orgs/${orgId}/invoices-allocs`;
    const PAYMENT_ALLOCS_REPO = (orgId: string) => `orgs/${orgId}/payments-allocs`;

    const _invoiceAllocsRepo = tools.getRepository<InvoiceAllocation>(INVOICE_ALLOCS_REPO(orgId));
    const _paymentAllocsRepo = tools.getRepository<PaymentAllocation>(PAYMENT_ALLOCS_REPO(orgId));

    let invoiceAlloc = await _invoiceAllocsRepo.getDocumentById(alloc[0].invId);
    let paymentAllocs = await _paymentAllocsRepo.getDocuments(new Query().where('id', 'in', payments));

    if (invoiceAlloc && paymentAllocs.length > 0) {

      // step 1: remove allocs from invoice
      paymentAllocs.map((payment) => {
        const { payment: _payment, invoice: _invoice } = REMOVE_ALLOC_ELEMENT(payment, invoiceAlloc, tools);
        payment = _payment;
        invoiceAlloc = _invoice;
      });

      // step 2: update invoice alloc
      if (invoiceAlloc.elements.length == 0) {
        await _invoiceAllocsRepo.delete(invoiceAlloc.id!);
      } else {

        if (invoiceAlloc?.balance)
          invoiceAlloc.balance = RESOLVE_BALANCE(invoiceAlloc.balance, invoiceAlloc.amount);

        if (invoiceAlloc?.credit)
          invoiceAlloc.credit = RESOLVE_BALANCE(invoiceAlloc.credit, invoiceAlloc.amount);

        // Update invoice alloc status
        invoiceAlloc.allocStatus = 5;
        await _invoiceAllocsRepo.update(invoiceAlloc);
      }

      // step 3: update payment allocs
      const pays$ = await Promise.all(paymentAllocs.map(async (payment) => {
        if (payment.elements.length == 0) {
          return await _paymentAllocsRepo.delete(payment.id!);
        } else {

          if (payment?.balance)
            payment.balance = RESOLVE_BALANCE(payment.balance, payment.amount);

          if (payment?.credit)
            payment.credit = RESOLVE_BALANCE(payment.credit, payment.amount);

          payment.allocStatus = 5;
          return await _paymentAllocsRepo.update(payment);
        }
      }));

      return await Promise.all(pays$);
    }
    return [];
  }
}