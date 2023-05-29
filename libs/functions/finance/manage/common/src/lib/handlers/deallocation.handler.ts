
import { Query } from '@ngfi/firestore-qbuilder';
import { HandlerTools, Repository } from '@iote/cqrs';
import { FunctionHandler, FunctionContext } from '@ngfi/functions';

import { Allocation } from '@app/model/finance/allocations';
import { PerfomPaymentsDeAllocation } from '../services/perfom-payments-deallocations.service';
import { PerfomInvoicesDeAllocation } from '../services/perfom-invoices-deallocations.service';


const ALLOCS_REPO = (orgId: string) => `orgs/${orgId}/allocs`;

/**
 * @class DeAllocation Handler.
 *
 * @description Deallocates object for a given bank transaction/invoice.
 */

export class DeAllocateHandler extends FunctionHandler<{ orgId: string, allocs: Allocation[], deAlloc: 'payments' | 'invoices' }, any>
{
  public async execute(data: { orgId: string, allocs: Allocation[], deAlloc: 'payments' | 'invoices' }, context: FunctionContext, tools: HandlerTools) {
    tools.Logger.log(() => `[DeAllocateHandler].execute: dealocatting trs for: ${data.orgId}`);
    tools.Logger.log(() => `[DeAllocateHandler].execute: allocs: ${data.allocs.length}`);

    const _allocsRepo = tools.getRepository<Allocation>(ALLOCS_REPO(data.orgId));

    // deallocate payments from an invoice
    if (data.deAlloc == 'payments') {

      const paymentsDeAllocService = new PerfomPaymentsDeAllocation();

      const payments = data.allocs.map((alloc) => alloc.pId);
      const allocObjects$ = await paymentsDeAllocService.perfomPaymentsDeAllocation(data.orgId, data.allocs, payments, tools);
      const allocs$ = await this.deleteAllocations(data.orgId, data.allocs, tools, _allocsRepo);

      return await Promise.all([...allocObjects$, ...allocs$]);
    }

    // deallocate invoices from a payment
    const invoicesDeAllocService = new PerfomInvoicesDeAllocation();
    const invoices = data.allocs.map((alloc) => alloc.invId);
    const allocObjects$ = await invoicesDeAllocService.perfomInvoicesDeAllocation(data.orgId, data.allocs, invoices, tools);
    const allocs$ = await this.deleteAllocations(data.orgId, data.allocs, tools, _allocsRepo);

    return await Promise.all([...allocObjects$, ...allocs$]);
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