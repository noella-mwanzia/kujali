import { groupBy as ___groupBy } from 'lodash';

import { Budget } from '@app/model/finance/planning/budgets';
import { TransactionPlan } from "@app/model/finance/planning/budget-items";

import { BudgetLineRow } from "@app/model/finance/planning/budget-rendering";
import { __CalculateLineAmounts } from './calculate-line-amounts.function';

/**
 * Starting point of our budget calculation. Via the budget explorer the user can plan transactions.
 * 
 * These transactions are part of a budget line. Each line can have one or more transactions.
 * In our budget calculation algorithm, we first get all the transaction occurences.
 * 
 * We then push them through here to convert them into budget lines which can eventually be counted up and aggregated to full blown
 *  budgets.
 * 
 * @param {TransactionPlan[]} occurences - The planned transactions the user inputted on the budget. 
 */
export function ___PlannedTransactionsToBudgetLines(budget: Budget, plannedItems: TransactionPlan[]) : BudgetLineRow[]
{
  const occurencesByLine = ___groupBy(plannedItems, 'transactionId');

  // Loop keys
  const byTransaction = [];
  for (const lineId in occurencesByLine)
  {
    // Take the first transaction -> Each row represents a transactions.
    // We therefore model the BudgetLines off of the planned transactions.
    const line = __CalculateLineAmounts(budget, occurencesByLine[lineId]);

    // Make sure only the transactions that have not been overriden are chosen.
    line.plans = occurencesByLine[lineId] // TODO(jrosseel): this._filterLastOccurences(budget, grouped[group]);
    byTransaction.push(line);
  }
  return byTransaction;
}
