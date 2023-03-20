import { EventContext } from "firebase-functions/v1";

import { FunctionContext, FunctionHandler } from "@ngfi/functions";
import { Query } from "@ngfi/firestore-qbuilder";
import { HandlerTools } from "@iote/cqrs";
import { __DateFromStorage } from '@iote/time';

import * as moment from 'moment-timezone';

import { DbEventTypes } from "@app/model/data/db";

import { BankTransaction } from "@app/model/finance/payments";

// import { FinancialYear, FinancialYearStatus } from "@app/model/accounting/financial-years";

export const PONTO_TRS_SUBSCR_PATH = 'orgs/{propId}/ponto-transactions/{trId}';
export const SWAN_TRS_SUBSCR_PATH = 'orgs/{propId}/bank-connections/{connectionId}/swan-transactions/{trId}';


const SWAN_PAY_IN_PREFIX = 'bosci_';
const SWAN_PAY_OUT_PREFIX = 'bosco_';
/**
 * @class BankPaymentsListener
 *
 * @description
 * 1. Combines all f-Year relevant bank transactions regardless of source.
 * 2. Listens to create/update events in the bank transactions sub-collections (Ponto and Swan)
 * and updates the payments sub-collection
 */
export class BankPaymentsListener extends FunctionHandler<BankTransaction, void>
{
  public async execute(bankTr: BankTransaction, context: FunctionContext, tools: HandlerTools)
  {
    const eventContext = context.eventContext.eventContext as EventContext;
    const propId    = eventContext.params.propId;
    const eventType = eventContext.eventType as DbEventTypes;

    tools.Logger.debug(() => `[BankPaymentsListener] Execute for ${propId} - transaction ${bankTr.id}`);
    tools.Logger.debug(() => `[BankPaymentsListener] Data -> ${JSON.stringify(bankTr)}`);
    tools.Logger.debug(() => `[BankPaymentsListener] Context -> ${JSON.stringify(eventContext)}.`);

    switch(eventType)
    {
      case DbEventTypes.Create:
      {
        tools.Logger.debug(() => `[BankPaymentsListener] EVENT = CREATE`);

        await this._createBankTr(bankTr, propId, tools);

        break;
      }
      case DbEventTypes.Update:
      {
        tools.Logger.debug(() => `[BankPaymentsListener] EVENT = UPDATE`);

        await this._updateBankTrDetails(bankTr, propId, tools);
      }
      break;
      case DbEventTypes.Delete:
        tools.Logger.debug(() => `[BankPaymentsListener] EVENT = DELETE-> Delete not allowed. No action required.`);
        break;
      default:
        tools.Logger.debug(() => `[BankPaymentsListener] EVENT = OTHER-> No action specified.`);
    }
  }

  /**
   * @private _createBankTr
   * @param {BankTransaction} bankTr the transaction to be created
   * @param {string} propId The org id
   * @param {HandlerTools} tools from execute() fn
   * @memberof BankPaymentsListener
   * @description Creates the bank transaction if it is within the active fYear bounds.
   */
  private async _createBankTr(bankTr: BankTransaction, propId: string, tools: HandlerTools)
  {
    // Get Active Financial year
    tools.Logger.log(() => `[BankPaymentsListener] _createBankTr: Fetching the active financial year.`);
    const _fYearRepo = tools.getRepository<FinancialYear>(`orgs/${propId}/financial-years`);
    const fYears = await _fYearRepo.getDocuments(new Query().where('status', '==', FinancialYearStatus.Active).orderBy('start', 'desc'));
    const activeFYear = fYears.length > 0 ? fYears[0] : null;

    if(activeFYear?.start)
    {
      // Switch to momentTimezone
      const yearStart = (__DateFromStorage(activeFYear.start) as moment.Moment).tz("Europe/Brussels").startOf('day');
      const bankTrDate = (__DateFromStorage(bankTr.date) as moment.Moment).tz("Europe/Brussels").endOf('day');

      // Account for internal transfers
      // In internal transfers, two transfers get fetched the Pay in has 'bosci_' prefix while Pay Out has 'bosco_' prefix
      const isPayIn = bankTr.id.includes(SWAN_PAY_IN_PREFIX);
      const currentId = bankTr?.id;
      const swanPayInId =  isPayIn ? bankTr?.id : currentId.replace(SWAN_PAY_OUT_PREFIX, SWAN_PAY_IN_PREFIX);
      const swanPayOutId = !isPayIn ? bankTr?.id : currentId.replace(SWAN_PAY_IN_PREFIX, SWAN_PAY_OUT_PREFIX);

      const _combinedRepo = tools.getRepository<BankTransaction>(`orgs/${propId}/bank-transactions`);
      const matchingId = await _combinedRepo.getDocuments(new Query().where('id', 'in', [bankTr.id, swanPayInId, swanPayOutId]));
      const alreadyExists = matchingId.length > 0 ? matchingId[0] : null;
      // Add to db
      if(bankTrDate.isSameOrAfter(yearStart, 'day'))
      {
        if(alreadyExists){
          bankTr.id = alreadyExists.id;
          bankTr.for = bankTr.for ?? alreadyExists.for;
          tools.Logger.log(() => `[BankPaymentsListener] _createBankTr: Updating bank tr ${bankTr.id} to db.`);
          await _combinedRepo.update(bankTr);
        }
        else{
          tools.Logger.log(() => `[BankPaymentsListener] _createBankTr: Adding bank tr ${bankTr.id} to db.`);
          await _combinedRepo.write(bankTr, bankTr.id);
        }
      }
      else{
        tools.Logger.log(() => `[BankPaymentsListener] _createBankTr: Bank transaction ${bankTr.id} is out of FYear scope. Skipping add to db step.`);
      }
    }
  }

  /**
   * @private _updateBankTrDetails
   * @param {BankTransaction} bankTr The updated transaction
   * @param {string} propId The org that the transaction belongs to
   * @param {HandlerTools} tools from .execute()
   * @return {Promise<BankTransaction>}
   * @memberof BankPaymentsListener
   * @description Only updates the relevant fields (i.e. those to do with bank transaction verification) to avoid over-writing allocations/reconciliations.
   */
  private async _updateBankTrDetails(bankTr: BankTransaction, propId: string, tools: HandlerTools)
  {
    const _combinedRepo = tools.getRepository<BankTransaction>(`orgs/${propId}/bank-transactions`);
    const alreadyExists = await _combinedRepo.getDocumentById(bankTr?.id);

    if(alreadyExists)
    {
      // Update the necessary fields.
      alreadyExists.verificationDate = bankTr.verificationDate;
      alreadyExists.trStatus = bankTr.trStatus;
      alreadyExists.verified = bankTr.verified;
      alreadyExists.date = bankTr.date;

      tools.Logger.log(() => `[BankPaymentsListener] Updating db object.`);
      return await _combinedRepo.update(alreadyExists);
    }
  }
}
