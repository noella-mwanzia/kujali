import { AmountPerMonth } from "@app/model/finance/planning/budget-lines";

/** 
 * Default AmountPerMonth. Set on initialisation of a budget. 
 */
export const NULL_AMOUNT_PER_MONTH = 
  () => ({ amount: 0, isOccurenceStart: false, baseAmount: 0, units: 0, occurenceId: 'init' }) as AmountPerMonth;
 