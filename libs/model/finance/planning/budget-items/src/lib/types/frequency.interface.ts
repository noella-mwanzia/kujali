/**
 * Frequency at which a budget item repeats or increases.
 */
export enum BudgetItemFrequency 
{
  /** Budget item occurs once */
  Once = 1,
  /** Budget item occurs every quarter */
  Quarterly = 90,
  /** Budget item occurs yearly */
  Year = 365,
  /** Budget item occurs every x months */
  EveryXTimes = 999,
  /** Budget item occurs never (for disabled budget line) */
  Never = 0
}
