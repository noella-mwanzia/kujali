import { AdminRepositoryFactory } from '@ngfi/admin-data';

import { FunctionHandler, FunctionContext } from '@ngfi/functions';
import { Query } from '@ngfi/firestore-qbuilder';
import { __DateFromStorage, __DateToStorage } from '@iote/time';
import { HandlerTools } from '@iote/cqrs';

import { chunk } from 'lodash';

import { FTransaction } from '@app/model/finance/payments';
import { BankTransaction } from '@app/model/finance/payments';


const ACCOUNT_PAYMENTS_REPO = (orgId: string) => `orgs/${orgId}/payments`;

const ACCOUNT_ALLOCS_REPO = (orgId: string) => `orgs/${orgId}/allocations`;

/**
 * @class SwitchToBankPaymentsHandler
 *
 * Step 1. Fetch active financial year.
 *
 * Step 2. Get all payments within the active financial year.
 *
 * Step 3. Delete the manual payments from the payments subcollection.
 *
 * Step 4. Add the fetched payments to the Manual payments subcollection.
 *
   */
export class SwitchToBankPaymentsHandler extends FunctionHandler<{ orgId: string; orgAccId: string }, void>
{
  public async execute(data: { orgId: string, orgAccId: string }, context: FunctionContext, tools: HandlerTools)
  {
    tools.Logger.log(() => `[SwitchToBankPaymentsHandler].execute: Switching from manual payments to bank payments for the active financial year. orgId: ${ data.orgId }, AccountId: ${ data.orgAccId }`);

    // Step 2. Get all payments 
    tools.Logger.log(() => `[SwitchToBankPaymentsHandler].execute: Fetching active year manual payments.`);
    const _paymentsRepo = tools.getRepository<BankTransaction>(ACCOUNT_PAYMENTS_REPO(data.orgId));

    // Factor in timezone fix when fetching payments to be deleted
    const startDate = __DateToStorage(__DateFromStorage(activeFYear.start).startOf('day'));
    let pmtQuery = new Query().where('date', '>=', startDate);
    const allActiveYearManualPayments = await _paymentsRepo.getDocuments(pmtQuery);
    const manualPayments = allActiveYearManualPayments.filter(payment => payment.to === data.orgAccId || payment.from === data.orgAccId);

    if(manualPayments.length)
    {
      // Step 3. Delete the manual payments from the payments subcollection
      tools.Logger.error(() => `Deleting ${ manualPayments.length } manual payments from payments db.`);
      await this.performPmtDeletions(data.orgId, startDate);

      // Step 4. Add the fetched payments to the Manual payments subcollection.
      tools.Logger.log(() => `[SwitchToBankPaymentsHandler].execute: Adding ${ manualPayments.length } to temp manual payments sub-collection.`);
      const _manualPaymentsRepo = tools.getRepository<FTransaction>(`orgs/${data.orgId}/manual-payments`);
      const add$ = manualPayments.map(pmt => _manualPaymentsRepo.write(pmt, pmt.id));

      await Promise.all(add$);

      // Step 5. Delete allocations associated with the manual payments.
      await this.performAllocDeletions(data.orgId, startDate, manualPayments, tools);
    }
    else{
      tools.Logger.log(() => `[SwitchToBankPaymentsHandler].execute: No manual payments to be reconciled.`);
      return;
    }
  }

  private async performPmtDeletions(orgId: string, startDate: any){
    const MAX_WRITES_PER_BATCH = 500; /** https://cloud.google.com/firestore/quotas#writes_and_transactions */

    const commitBatchPromises = [];
    const _db = (AdminRepositoryFactory as any).__getStore() as FirebaseFirestore.Firestore;
    const snapshot = await _db.collection(ACCOUNT_PAYMENTS_REPO(orgId)).where('date', '>=', startDate).get();

    const batches = chunk(snapshot.docs, MAX_WRITES_PER_BATCH);
    batches.forEach(batch => {
      const writeBatch = _db.batch();
      batch.forEach(doc => writeBatch.delete(doc.ref));
      commitBatchPromises.push(writeBatch.commit());
    });

    await Promise.all(commitBatchPromises);
  }

  private async performAllocDeletions(orgId: string, startDate: any, manualPayments: FTransaction[], tools: HandlerTools){
    const MAX_WRITES_PER_BATCH = 500; /** https://cloud.google.com/firestore/quotas#writes_and_transactions */

    const commitBatchPromises = [];
    const _db = (AdminRepositoryFactory as any).__getStore() as FirebaseFirestore.Firestore;
    const snapshot = await _db.collection(ACCOUNT_ALLOCS_REPO(orgId)).where('createdOn', '>=', startDate).get();
    tools.Logger.error(() => `Found ${ snapshot.docs.length } allocations created within the active fYear period.`);

    // Filter allocs related to manual payments
    const relevantAllocs = snapshot.docs.filter(allocSnap => !!manualPayments.find(pmt => pmt.id === allocSnap.data().tr));
    tools.Logger.error(() => `Found ${ relevantAllocs.length } allocations related to manual payments that need to be deleted.`);
    tools.Logger.error(() => `Deleting ${ relevantAllocs.length } allocations from allocs db.`);

    if(relevantAllocs.length){
      const batches = chunk(relevantAllocs, MAX_WRITES_PER_BATCH);
      batches.forEach(batch => {
        const writeBatch = _db.batch();
        batch.forEach(doc => writeBatch.delete(doc.ref));
        commitBatchPromises.push(writeBatch.commit());
      });

      await Promise.all(commitBatchPromises);
    }
  }
}

