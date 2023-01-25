import { HandlerTools } from "@iote/cqrs";

import { BudgetHeaderResult } from "@app/model/finance/planning/budget-lines";
import { Budget } from "@app/model/finance/planning/budgets";

import { __PubSubPublishAction } from "@app/functions/pubsub";

/**
 * Loops through and updates all the parent budgets headers 
 * @param header
 * @param tools
 */
export async function updateParentHeaders(BUDGET_PARENTS_IDS: string[], header: BudgetHeaderResult, budgetData: Budget, tools: HandlerTools) {
  tools.Logger.log(() => `updating parent header results`);

  if (BUDGET_PARENTS_IDS.length > 0) {

    if (BUDGET_PARENTS_IDS.includes(budgetData.id!))
      throw 'This scenario will cause endless loop';

    BUDGET_PARENTS_IDS.map(async (id) => {
      let headerValue = {
        orgId: header.orgId,
        parentBudgetId: id,
        childHeaderResult: header
      }

      await _calculateParentBudgetHeaders(headerValue, tools);
    })
  }
}

/**
 * Triggers a pubsub topic that updates the parent budget passed with the
 * result of the rendered child
 * @param headerValues 
 * @param tools 
 */
export async function _calculateParentBudgetHeaders(headerValues: { orgId: string, parentBudgetId: string, 
                                                    childHeaderResult: BudgetHeaderResult }, tools: HandlerTools) 
{
  tools.Logger.log(() => `Triggering parent budget headers recalculation for ${headerValues.parentBudgetId}`);
  await __PubSubPublishAction<any>('bdgtCalculateHeaderPubSub', headerValues);
}