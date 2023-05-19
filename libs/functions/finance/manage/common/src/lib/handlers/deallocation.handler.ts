import { HandlerTools, Repository } from '@iote/cqrs';
import { FunctionHandler, FunctionContext } from '@ngfi/functions';
import { Query } from '@ngfi/firestore-qbuilder';

import { Allocation, PaymentAllocation } from '@app/model/finance/allocations';
import { InvoiceAllocation } from '@app/model/finance/invoices';


const ALLOCS_REPO = (orgId: string) => `orgs/${orgId}/allocs`;
const INVOICE_ALLOCS_REPO = (orgId: string) => `orgs/${orgId}/invoices-allocs`;
const PAYMENT_ALLOCS_REPO = (orgId: string) => `orgs/${orgId}/payments-allocs`;

/**
 * @class DeAllocation Handler.
 *
 * @description Deallocates object for a given bank transaction/invoice.
 */

export class DeAllocateHandler extends FunctionHandler<{orgId: string, allocs: Allocation[], deAlloc: 'payments' | 'invoices'}, any>
{
  public async execute(data: {orgId: string, allocs: Allocation[], deAlloc: 'payments' | 'invoices'}, context: FunctionContext, tools: HandlerTools) {
    tools.Logger.log(() => `[DeAllocateHandler].execute: dealocatting trs for: ${data.orgId}`);
    tools.Logger.log(() => `[DeAllocateHandler].execute: allocs: ${data.allocs.length}`);

    const _allocsRepo =  tools.getRepository<Allocation>(ALLOCS_REPO(data.orgId));

    // deallocate payments from an invoice
    if (data.deAlloc == 'payments') {

      const payments = data.allocs.map((alloc) => alloc.pId);
      const allocObjects$ = await this.perfomPaymentsDeAllocation(data.orgId, data.allocs, payments, tools);
      const allocs$ = await this.deleteAllocations(data.orgId, data.allocs, tools, _allocsRepo);

      return await Promise.all([...allocObjects$, ...allocs$]);
    }

    // deallocate invoices from a payment
    const invoices = data.allocs.map((alloc) => alloc.invId);
    const allocObjects$ = await this.perfomInvoicesDeAllocation(data.orgId, data.allocs, invoices, tools);
    const allocs$ = await this.deleteAllocations(data.orgId, data.allocs, tools, _allocsRepo);

    return await Promise.all([...allocObjects$, ...allocs$]);
  }

  private async perfomPaymentsDeAllocation(orgId: string, alloc: Allocation[], payments: string[], tools: HandlerTools) {
    tools.Logger.log(() => `[perfomPaymentsDeAllocation]: starting deallocation for: ${alloc[0].invId} && ${payments.length}`);

    const _invoiceAllocsRepo =  tools.getRepository<InvoiceAllocation>(INVOICE_ALLOCS_REPO(orgId));
    const _paymentAllocsRepo =  tools.getRepository<PaymentAllocation>(PAYMENT_ALLOCS_REPO(orgId));

    let invoiceAlloc = await _invoiceAllocsRepo.getDocumentById(alloc[0].invId);
    let paymentAllocs = await _paymentAllocsRepo.getDocuments(new Query().where('id', 'in', payments));

    if (invoiceAlloc && paymentAllocs.length > 0) {

      // step 1: remove allocs from invoice
      paymentAllocs.map((payment) => {
        const { payment: _payment, invoice: _invoice } = this.removeAllocElement(payment, invoiceAlloc, tools);
        payment = _payment;
        invoiceAlloc = _invoice;
      });

      // step 2: update invoice alloc
      if (invoiceAlloc.elements.length == 0) {
        await _invoiceAllocsRepo.delete(invoiceAlloc.id!);
      } else {
        // Update invoice alloc status
        invoiceAlloc.allocStatus = 5;
        await _invoiceAllocsRepo.update(invoiceAlloc);
      }

      // step 3: update payment allocs
      const pays$ = await Promise.all(paymentAllocs.map(async (payment) => {
        if (payment.elements.length == 0) {
          return await _paymentAllocsRepo.delete(payment.id!);
        } else {
          payment.allocStatus = 5;
          return await _paymentAllocsRepo.update(payment);
        }
      }));

      return await Promise.all(pays$);
    }
    return [];
  }

  private async perfomInvoicesDeAllocation(orgId: string, allocs: Allocation[], invoices: string[], tools: HandlerTools) {
    tools.Logger.log(() => `[perfomInvoicesDeAllocation]: starting dealocation for: ${allocs[0].pId} && ${invoices.length}`);

    const _invoiceAllocsRepo =  tools.getRepository<InvoiceAllocation>(INVOICE_ALLOCS_REPO(orgId));
    const _paymentAllocsRepo =  tools.getRepository<PaymentAllocation>(PAYMENT_ALLOCS_REPO(orgId));

    let paymentAlloc = await _paymentAllocsRepo.getDocumentById(allocs[0].pId);
    let invoiceAllocs = await _invoiceAllocsRepo.getDocuments(new Query().where('id', 'in', invoices));

    if (paymentAlloc && invoiceAllocs.length > 0) {

      // step 1: remove allocs from payment
      invoiceAllocs.map((invoice) => {
        const { payment: _payment, invoice: _invoice } = this.removeAllocElement(paymentAlloc, invoice, tools);
        paymentAlloc = _payment;
        invoice = _invoice;
      });

      // step 2: update invoice allocs
      const invs$ = await Promise.all(invoiceAllocs.map(async (invoice) => {
        if (invoice.elements.length == 0) {
          return await _invoiceAllocsRepo.delete(invoice.id!);
        } else {
          invoice.allocStatus = 5;
          return await _invoiceAllocsRepo.update(invoice);
        }
      }));

      // step 3: update payment alloc
      if (paymentAlloc.elements.length == 0) {
        await _paymentAllocsRepo.delete(paymentAlloc.id!);
      } else {
        paymentAlloc.allocStatus = 5;
        await _paymentAllocsRepo.update(paymentAlloc);
      }

      return await Promise.all(invs$);
    }
    return [];
  }

  private removeAllocElement(payment: PaymentAllocation, invoice: InvoiceAllocation, tools: HandlerTools) {
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


  private async deleteAllocations(orgId: string, allocs: Allocation[], tools: HandlerTools, _allocsRepo: Repository<Allocation>) {
    tools.Logger.log(() => `[deleteAllocations]: starting delete allocs ${allocs.length}}`);
    return allocs.map(async (alloc) => {
      const allocation: Allocation = await _allocsRepo.getDocuments(new Query().where('pId', '==', alloc.pId).where('invId', '==', alloc.invId))[0];
      if (allocation) {
        tools.Logger.log(() => `[deleteAllocations]: deleting ${allocation.id}}`);
        await _allocsRepo.delete(allocation.id!);
      }
    })
  }
}