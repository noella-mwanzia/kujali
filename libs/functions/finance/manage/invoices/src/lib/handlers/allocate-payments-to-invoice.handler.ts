import { HandlerTools } from '@iote/cqrs';
import { FunctionHandler, FunctionContext } from '@ngfi/functions';
import { Query } from '@ngfi/firestore-qbuilder';

import { BankTransaction } from '@app/model/finance/payments';
import { Invoice, InvoiceAllocation } from '@app/model/finance/invoices';

import { Allocation, PaymentAllocation } from '@app/model/finance/allocations';

import { PaymentsToInvoiceP } from '../services/allocate-payments-to-invoice-pym.service';
import { PaymentsToInvoiceI } from '../services/allocate-payments-to-invoices-inv.service';

const PAYMENTS_REPO = (orgId: string) => `orgs/${orgId}/payments`;
const PAYMENT_ALLOCS_REPO = (orgId: string) => `orgs/${orgId}/payments-allocs`;

const INVOICES_REPO = (orgId: string) => `orgs/${orgId}/invoices`;
const INVOICES_ALLOCS_REPO = (orgId: string) => `orgs/${orgId}/invoices-allocs`;

/**
 * @class AllocatePaymentsToInvoiceHandler.
 *
 * @description Creates a payment allocation for a given bank transaction.

 */
export class AllocatePaymentsToInvoiceHandler extends FunctionHandler<{ orgId: string, allocs: Allocation[]}, PaymentAllocation[]>
{
  public async execute(data: { orgId: string, allocs: Allocation[]}, context: FunctionContext, tools: HandlerTools) {
    tools.Logger.log(() => `[AllocatePaymentsToInvoiceHandler].execute: allocating payments for: ${data.orgId}`);

    // step 1. get invoice
    tools.Logger.log(() => `[AllocatePaymentsToInvoiceHandler].execute: selected invoice: ${data.allocs[0].invId}`);
    const invoicesRepo =  tools.getRepository<Invoice>(INVOICES_REPO(data.orgId));
    const invoice = await invoicesRepo.getDocumentById(data.allocs[0].invId);

    // step 2. get payments
    const paymentsRepo =  tools.getRepository<BankTransaction>(PAYMENTS_REPO(data.orgId));
    const selectedPayments: string[] = data.allocs.map((a) => a.pId);

    tools.Logger.log(() => `[AllocatePaymentsToInvoiceHandler].execute: selected payments: ${selectedPayments}`);

    const payments = await paymentsRepo.getDocuments(new Query().where('id', 'in', selectedPayments));

    // step 3. create invoice allocation
    const _invoiceAllocsService = new PaymentsToInvoiceI(tools.Logger);
    const invAllocsRepo =  tools.getRepository<InvoiceAllocation>(INVOICES_ALLOCS_REPO(data.orgId));

    const invoiceAlloc = await _invoiceAllocsService.createSingleInvoiceAllocation(payments, invoice, data.allocs, invAllocsRepo);
    await invAllocsRepo.write(invoiceAlloc, invoiceAlloc.id!);


    // step 4. create payments allocations
    const _paymentAllocsService = new PaymentsToInvoiceP(tools.Logger);

    const paymentAllocsRepo =  tools.getRepository<PaymentAllocation>(PAYMENT_ALLOCS_REPO(data.orgId));
    const allocatedPayments = payments.map((p) => _paymentAllocsService.createPaymentAllocation(p, invoice, data.allocs, paymentAllocsRepo));

    const allPays = await Promise.all(allocatedPayments);

    tools.Logger.log(() => `[AllocatePaymentsToInvoiceHandler].execute: created invoice allocations for invoices: ${allocatedPayments.length}`);

    const payAllocs = allPays.map(i => paymentAllocsRepo.write(i, i.id!));

    const allocPayments$ = await Promise.all(payAllocs);
    return allocPayments$;
  }
}