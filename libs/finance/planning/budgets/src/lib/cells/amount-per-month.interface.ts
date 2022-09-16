// import { TransactionOccurence } from "../../../transactions/transaction-occurence.interface";

export interface AmountPerMonth 
{
  amount: number;

  baseAmount: number;
  units: number;

  isOccurenceStart?: boolean;

  // Reference variable for ease of updating the budget.
  // occurence?: TransactionOccurence;
}
