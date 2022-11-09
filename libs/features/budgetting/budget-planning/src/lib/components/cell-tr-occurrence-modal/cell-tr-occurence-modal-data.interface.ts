import { PlannedTransaction } from "../../model/planned-transaction.interface";
import { TransactionOccurence } from "../../model/transaction-occurence.interface";

export interface CellTrOccurenceModalData {
  
  amount: number;
  units: number;
  
  monthFrom: number;
  yearFrom: number;

  type: string;

  budgetId: string;

  update: boolean;
  
  occurence: TransactionOccurence;
}