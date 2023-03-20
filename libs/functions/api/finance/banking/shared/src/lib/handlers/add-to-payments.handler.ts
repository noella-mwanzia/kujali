import { EventContext } from 'firebase-functions/v1';

import { FunctionHandler, FunctionContext } from '@ngfi/functions';
import { HandlerTools, Repository } from '@iote/cqrs';

import { DbEventTypes, DbMethods } from "@app/model/data/db";

import { __PubSubPublishAction } from '@app/functions/pubsub';


import { BankTransaction, WritePaymentCommand } from '@app/model/finance/payments';

import { WritePaymentHandler } from '@app/functions/finance/manage/payments';


export const BANK_TRS_SUBSCR_PATH = 'orgs/{propId}/bank-transactions/{trId}';
/**
  * @class AddToPaymentsHandler
  *
  * Step 1. Get event context params.
  *
  * Step 2. Apply create/update to payments repo.
  *
  */
export class AddToPaymentsHandler extends FunctionHandler<BankTransaction, void>
{
  public async execute(bankTr: BankTransaction, context: FunctionContext, tools: HandlerTools)
  {
    // Step 1. Get event context params
    const eventContext = context.eventContext.eventContext as EventContext;
    const propId    = eventContext.params.propId;
    const eventType = eventContext.eventType as DbEventTypes;

    tools.Logger.debug(() => `[AddToPaymentsHandler] Execute for prop: ${propId} - transaction ${bankTr.id}`);
    tools.Logger.debug(() => `[AddToPaymentsHandler] Data -> ${JSON.stringify(bankTr)}`);
    tools.Logger.debug(() => `[AddToPaymentsHandler] Context -> ${JSON.stringify(eventContext)}.`);

    tools.Logger.log(() => `[AddToPaymentsHandler] EVENT = ${ eventType }`);

    try{
      switch(eventType)
      {
        case DbEventTypes.Create:
        case DbEventTypes.Update:
        {
          await this.performCreateOrUpdate(bankTr, propId, context, tools);
          break;
        }
        default:
          tools.Logger.debug(() => `[AddToPaymentsHandler] EVENT = ${eventType} -> No action specified for this type of event.`);
      }
    }
    catch(error){
      tools.Logger.debug(() => `[AddToPaymentsHandler] An error occurred processing bankTr ${bankTr?.id} -> ${JSON.stringify(error)}.`);
    }

  }

  async performCreateOrUpdate(pmt: BankTransaction, propId: string, context: FunctionContext, tools: HandlerTools){
    const existingInstances = await this.checkExisted(pmt, propId, tools);
    const alreadyExists = { ...existingInstances.optimisticPayment, ...existingInstances.existed };

    if(alreadyExists){
      tools.Logger.log(() => `[AddToPaymentsHandler]. Updating optimistic/existing payment with bank transaction details. PropId: ${ propId }. Data: ${JSON.stringify(pmt)}`);
    }
    else{
      tools.Logger.log(() => `[AddToPaymentsHandler]. Creating payment from bank transaction details. PropId: ${ propId }. Data: ${JSON.stringify(pmt)}`);
    }

    const payment = await this.appendPaymentInfo(propId, pmt, tools);

    const call = {
      propId: propId,
      payment: payment,
      method: existingInstances.optimisticPayment ? DbMethods.UPDATE : DbMethods.CREATE
    } as WritePaymentCommand;

    try{
      tools.Logger.log(() => `[AddToPaymentsHandler] Performing: ${ call.method === DbMethods.UPDATE ? 'update' : 'create' }. Existing obj: ${JSON.stringify(alreadyExists)}`);
      const handler = new WritePaymentHandler();
      return await handler.execute(call, context, tools);
    } catch(err){
      tools.Logger.log(() => `[AddToPaymentsHandler] Error performing payment write to db. PropId: ${ propId }. Data: ${JSON.stringify(call)}`);
      tools.Logger.log(() => `[AddToPaymentsHandler] Error: ${JSON.stringify(err)}`);
      throw(err)
    }
  }

  async appendPaymentInfo(propId: string, bankTr: BankTransaction, tools: HandlerTools){
    const checkExisted = await this.checkExisted(bankTr, propId, tools);
    const existed = { ...checkExisted.optimisticPayment, ...checkExisted.existed };
    bankTr.for = existed.for ?? [];

    // Add allocation info from the placeholder transaction
    if(existed?.id){
      tools.Logger.log(() => `[AddToPaymentsHandler] Appending allocation data to the bank transaction, id: ${ bankTr.id }. Existing obj: ${JSON.stringify(existed)}`);
      bankTr.id = existed.id;
      bankTr.for = existed.for ?? [];
      bankTr.to = existed.to;
      bankTr.from = existed.from;
      bankTr.notes = existed.notes;
      (bankTr as any).isOptimistic = false;
    }

    return bankTr;
  }

  /**
   * Check if there were any placeholder payments with the reconciliation info for this bank transaction
   * Bank Transaction to Kujali optimistic payments are mapped 1 == 1
   * @param bankTr
   */
  async checkExisted(bankTr: BankTransaction, propId: string, tools: HandlerTools){
    const _paymentsRepo = tools.getRepository<BankTransaction>(`orgs/${propId}/payments`);
    const _placeholderPaymentsRepo = tools.getRepository<BankTransaction>(`orgs/${propId}/manual-payments`);
    let remittanceId = bankTr?.for?.length > 0 ? bankTr.for[0] : null;

    if(remittanceId){
      // Avoid path errors caused by "/" character in some bank transactions remittance info
      const splitUpRemittance = remittanceId.split('/');
      remittanceId = splitUpRemittance.join(' ');
    }

    const fromRemittance = remittanceId ? await _placeholderPaymentsRepo.getDocumentById(remittanceId) : null;
    const alreadyExisted = await _placeholderPaymentsRepo.getDocumentById(bankTr.id);
    // Add check for any optimistic payment in payments collection, if exist perform update
    const optimisticPayment = remittanceId ? await _paymentsRepo.getDocumentById(remittanceId) : await _paymentsRepo.getDocumentById(bankTr?.id);

    const existed = { ...alreadyExisted, ...fromRemittance, ...optimisticPayment };
    return { existed, optimisticPayment };
  }

}

