import { BudgetItemFrequency, TransactionPlan } from "@app/model/finance/planning/budget-items";

/**
 * Returns a default empty cell for the transaction planner.
 * 
 * @param orgId     - Organisation ID
 * @param budgetId  - (Rendered) Budget ID
 * @param trCatId   - Category ID (first order grouping)
 * @param trTypeId  - Type ID (second order grouping)
 * @param lineId    - Line ID (last grouping, budget line)
 * @param lineName  - Line Name
 * @param month     - Month 
 * @param year      - Year
 * 
 * @returns TransactionPlan - A visualized cell
 */
export function __INIT_TR_PLANNER_TRANSACTION_CELL(orgId: string, budgetId: string, trCatId: string, trTypeId: string, lineId: string, lineName: string, month: number, year: number) : TransactionPlan
{
  return { 
    orgId, budgetId, lineId, trTypeId, trCatId,
    lineName,

    fromMonth: month,
    fromYear: year,
    frequency: BudgetItemFrequency.Monthly,

    mode: 1,
    
    amount: 0, 
    units: 0, 

    xTimesInterval: BudgetItemFrequency.Never,
    hasIncrease: false,
    
    king: false
  };
}