import { AmountPerMonth } from "@kujali/model/finance/planning/budgets";

/** 
 * Default AmountPerMonth. Set on initialisation of a budget. 
 */
export const NULL_AMOUNT_PER_MONTH: AmountPerMonth = { amount: 0, isOccurenceStart: false, baseAmount: 0, units: 0, occurenceId: 'init' };
