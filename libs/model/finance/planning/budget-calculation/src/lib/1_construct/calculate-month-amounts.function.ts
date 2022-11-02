import { maxBy as ___maxBy } from 'lodash';

import { BudgetItemFrequency, TransactionPlan, ValueIncreaseConfig } from "@app/model/finance/planning/budget-items";

import { NULL_AMOUNT_PER_MONTH } from "@app/model/finance/planning/budget-defaults";
import { AmountPerMonth, CalculatedAmountPerMonth } from "@app/model/finance/planning/budget-lines";

/** 
 * Function which calculate the amount of a budget line for a specific year and month.
 *  
 *  - Calculation algorithm which (1) Determines if a payment is due this month
 *                                (2) Takes into account amount scaling (amount and unit increase over time),
 *  
 * @param y             - Year of budget column
 * @param m             - Month of budget column
 * @param orderedPlans  - Plans ordered by year, then month 
 * 
 * @returns {AmountPerMonth} - Value of the month.
 */
export function __CalculateAmountForMonth(y: number, m: number, orderedPlans: TransactionPlan[]) : AmountPerMonth
{
  // 1. Select the plan relevant to the month and year.
  const plan = _selectMostRelevantPlan(y, m, orderedPlans);
  
  // 2. If plans exist, find the correct one and calculate its value. If not, return the NULL month.
  return plan ? _calculateAmountForMonth(y, m, plan)
              // If there are no relevant plans, this is not a cost yet.
              : NULL_AMOUNT_PER_MONTH();
} 

function _selectMostRelevantPlan(y: number, m: number, orderedPlans: TransactionPlan[])
{
  // 1. Only look at plans earlier than or on the same month as today.
  const relevantPlans = orderedPlans
          .filter((plan) => plan.fromYear < y || 
                           (plan.fromYear == y && plan.fromMonth <= m));

  // If there are relevant plans, get the last of those. Since we filtered out everything later, this is the correct one. 
  //    There are 12 months so if we do year * 100 + month[1-12] we get a max function with priority 1 year (first 4 digits), priority 2 month (last 2 digits). 
  return ___maxBy(relevantPlans, 
                  (plan) => plan.fromYear * 100 + plan.fromMonth);
}

//
// - CALCULATION ALGO
//

/**
 * Calculates value of plan for a given year and month.
 */
 function _calculateAmountForMonth(y: number, m: number, plan: TransactionPlan): CalculatedAmountPerMonth
 {
    // Check if we need to calculate at this step.
    const payNow = _planHasAmountOnMonth(y, m, plan);
    if(!payNow) {
      const nullAmnt = NULL_AMOUNT_PER_MONTH() as CalculatedAmountPerMonth;
      nullAmnt.plan = plan;
      return nullAmnt;
    }

   const base = _getPlanAmount(y, m, plan);
   const units = _getPlanUnits(y, m, plan);
   const mode = plan.mode;

   // The calculation
   const totalMonth = _getPlanAmount(y, m, plan) * _getPlanUnits(y, m, plan) * mode;
 
   return {
     amount: totalMonth,
     isOccurenceStart: _isOccurenceStart(y, m, plan), 
     plan,
     
     baseAmount: base,
     units: units
   };
 }

/** Checks if the plan produces a value on a given month. */
function _planHasAmountOnMonth(y: number, m: number, plan: TransactionPlan) 
{
  switch (plan.frequency)
  {
    case BudgetItemFrequency.Once:        return _isOccurenceStart(y, m, plan); 
    case BudgetItemFrequency.Monthly:     return true; 
    case BudgetItemFrequency.Year:        return (plan.fromMonth == m);
    case BudgetItemFrequency.EveryXTimes: return ((plan.fromMonth - m) % plan.xTimesInterval === 0);
  }

  return false;
}

  /** Calculates the transaction value. */
  function _getPlanAmount(y: number, m: number, plan: TransactionPlan)
  {
    if(!plan.hasIncrease)
      return plan.amount;

    return _calculateTransactionValueWithIncrease(y, m, plan, plan.amount, plan.amntIncrConfig);
  }

  /** Calculates the unit value. */
  function _getPlanUnits(y: number, m: number, plan: TransactionPlan)
  {
    if(!plan.hasIncrease)
      return plan.units;

    return _calculateTransactionValueWithIncrease(y, m, plan, plan.units, plan.unitIncrConfig, true); ;
  }

  /** Applies increase rate calculations on the value. */
  function _calculateTransactionValueWithIncrease(y: number, m: number, plan: TransactionPlan, amount: number, increase?: ValueIncreaseConfig, isUnits = false)
  {
    if(!increase)
      return amount;

    const increasedAm = amount * Math.pow(1 + increase.incrRate / 100, _getFrequencyCount(y, m, plan, increase.incrFreq, increase.interval));

    // Units cannot have floating values
    return isUnits ? Math.floor(increasedAm)
                   : increasedAm;
  }

  function _getFrequencyCount(y: number, m: number, plan: TransactionPlan, incrFreq?: BudgetItemFrequency, interval?: number)
  {
    if(incrFreq)
      switch (incrFreq) 
      {
        case BudgetItemFrequency.Monthly:     return _monthsAgo(plan.fromYear, plan.fromMonth, y, m);
        case BudgetItemFrequency.Quarterly:   return _monthsAgo(plan.fromYear, plan.fromMonth, y, m) / 3;
        case BudgetItemFrequency.EveryXTimes: return _monthsAgo(y, m, plan.fromYear, plan.fromMonth) / (interval as number);
        case BudgetItemFrequency.Year:        return _yearsAgo(plan.fromYear, y);
      }

    return 0;
  }

    const _monthsAgo = (y1: number, m1: number, y2: number, m2: number) => ((y2 - y1) * 12) + (m2 - m1);
    const _yearsAgo  = (y1: number, y2: number) => y2 - y1;

//
// - MISC
//

/** Checks if this month is the occurenceStart of a given plan */
function _isOccurenceStart(year: number, month: number, plan: TransactionPlan) 
{
  return plan.fromYear == year && plan.fromMonth == month;
}
