import { HandlerTools } from "@iote/cqrs";
import { Query } from '@ngfi/firestore-qbuilder';

import { InvoiceAllocation } from "@app/model/finance/invoices";
import { Allocation, PaymentAllocation } from "@app/model/finance/allocations";

import { RESOLVE_BALANCE } from "../providers/resolve-balance.function";
import { REMOVE_ALLOC_ELEMENT } from "../providers/remove-alloc-element.function";

export class PerfomInvoicesDeAllocation {
  
  constructor() { }

  async perfomInvoicesDeAllocation(orgId: string, allocs: Allocation[], invoices: string[], tools: HandlerTools) {
    tools.Logger.log(() => `[perfomInvoicesDeAllocation]: starting dealocation for: ${allocs[0].pId} && ${invoices.length}`);

    const INVOICE_ALLOCS_REPO = (orgId: string) => `orgs/${orgId}/invoices-allocs`;
    const PAYMENT_ALLOCS_REPO = (orgId: string) => `orgs/${orgId}/payments-allocs`;

    const _invoiceAllocsRepo = tools.getRepository<InvoiceAllocation>(INVOICE_ALLOCS_REPO(orgId));
    const _paymentAllocsRepo = tools.getRepository<PaymentAllocation>(PAYMENT_ALLOCS_REPO(orgId));

    let paymentAlloc = await _paymentAllocsRepo.getDocumentById(allocs[0].pId);
    let invoiceAllocs = await _invoiceAllocsRepo.getDocuments(new Query().where('id', 'in', invoices));

    if (paymentAlloc && invoiceAllocs.length > 0) {

      // step 1: remove allocs from payment
      invoiceAllocs.map((invoice) => {
        const { payment: _payment, invoice: _invoice } = REMOVE_ALLOC_ELEMENT(paymentAlloc, invoice, tools);
        paymentAlloc = _payment;
        invoice = _invoice;
      });

      // step 2: update invoice allocs
      const invs$ = await Promise.all(invoiceAllocs.map(async (invoice) => {
        if (invoice.elements.length == 0) {
          return await _invoiceAllocsRepo.delete(invoice.id!);
        } else {

          if (invoice?.balance)
            invoice.balance = RESOLVE_BALANCE(invoice.balance, invoice.amount);

          if (invoice?.credit)
            invoice.credit = RESOLVE_BALANCE(invoice.credit, invoice.amount);

          invoice.allocStatus = 5;
          return await _invoiceAllocsRepo.update(invoice);
        }
      }));

      // step 3: update payment alloc
      if (paymentAlloc.elements.length == 0) {
        await _paymentAllocsRepo.delete(paymentAlloc.id!);
      } else {

        if (paymentAlloc?.balance)
          paymentAlloc.balance = RESOLVE_BALANCE(paymentAlloc.balance, paymentAlloc.amount);

        if (paymentAlloc?.credit)
          paymentAlloc.credit = RESOLVE_BALANCE(paymentAlloc.credit, paymentAlloc.amount);

        paymentAlloc.allocStatus = 5;
        await _paymentAllocsRepo.update(paymentAlloc);
      }

      return await Promise.all(invs$);
    }
    return [];
  }

}