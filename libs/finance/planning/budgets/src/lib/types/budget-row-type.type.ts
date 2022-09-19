/**
 * The different types of Budget-rows.
 * 
 * Most are a cost or income, yet in the result-table different categories exist.
 */
export enum BudgetRowType 
{
  /** A configurable and assignable budget line. */
  Line = 1,
  
  /** A budget category. Aggregates a set of lines. */
  Category = 2,

  /** Total of the income lines of the budget */
  IncomeTotal = 6,

  /** Total of the cost lines of the budget */
  CostTotal = 7,

  /** A result of a budget child */
  ChildResult = 88,

  /** Result of the budget = Income - Cost + SUM(ChildResults) */
  Result = 8,

  /** Balance of the budget = REDUCE(RESULT PREV MONTH + RESULT CURR MONTH) */
  Balance = 9,

  /** Other lines */
  Other = 999
}
