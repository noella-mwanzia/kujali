import { HandlerTools } from "@iote/cqrs";

import { Budget } from "@app/model/finance/planning/budgets";
import { TransactionPlan } from "@app/model/finance/planning/budget-items";
import { RenderedBudget } from "@app/model/finance/planning/budget-rendering";
import {___CalculateLocalBudget, ___PlannedTransactionsToBudgetLines,
        ___RenderBudget } from "@app/model/finance/planning/budget-calculation";


/**
 * Takes a budget and it's plans and calculates the rendered budget result
 * @param budget 
 * @param plans 
 * @param tools 
 * @returns returns a rendered a budget result with values for all months
 */
export function calculateHeaderResults(budget: Budget, plans: TransactionPlan[], tools: HandlerTools): RenderedBudget {
  tools.Logger.log(() => `Calculating header results based on plans`);

  const lines = ___PlannedTransactionsToBudgetLines(budget, plans);

  const localBudget = ___CalculateLocalBudget(budget, lines);

  let renderedBudget = ___RenderBudget(budget, [], localBudget);

  return renderedBudget;
}