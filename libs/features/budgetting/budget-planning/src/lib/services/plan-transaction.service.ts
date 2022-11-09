import { Injectable } from "@angular/core";

import * as _ from "lodash";

import { Query } from "ngfire-firestore-query-builder";
import { BackendService, Repository } from "ngfire-angular";

import { PlannedTransaction } from "../model/planned-transaction.interface";

import { CreateTransactionForm } from "../model/create-transaction-form.interface";
import { CreateOccurenceForm } from "../model/create-occurence-form.interface";
import { Logger, ToastService } from '@elewa/angular-bricks';
import { DataService } from 'src/base-modules/core/data/data.service';

export const PLANNED_TRANSACTION_COLL = 'planned-transactions';
export const TRANSACTION_OCCURENCES_SUBCOLL = 'plans';

const _GuardNull = (val, nll) => val ? val : nll;
const _GuardNullNum = (val) => _GuardNull(val, 0);

@Injectable()
export class PlanTransactionService
{
  private _planTransactionRepo: Repository<PlannedTransaction>;

  constructor(private _backendService: BackendService,
              private _logger: Logger, 
              private _dataService: DataService,
              private _toastService: ToastService) 
  { 
    this._planTransactionRepo = this._dataService.getPlannedTransactionRepo(); 
  }

  planTransaction(form: CreateTransactionForm) {
    return this._backendService.callFunction('createTransaction', form);
  }

  planOccurence(form: CreateOccurenceForm) {
    return this._backendService.callFunction('createOccurence', form);
  }

  // planTransactionOccurenceFromForm(transactionOccForm: TransactionOccurence, oldOcc: TransactionOccurence, budgetId: string, update: any)
  // {
  //   const plan = this._readPlTransFormOccurance(budgetId, transactionOccForm);
  
  //   plan.transactionId = oldOcc.transactionId;
  //   plan.transactionTypeId = oldOcc.transactionTypeId;
  //   plan.baseTypeMultiplier = oldOcc.baseTypeMultiplier;
  //   plan.transactionCategoryId = oldOcc.transactionCategoryId;
  //   plan.transactionCategoryName = oldOcc.transactionCategoryName;

  //   if(update.isUpdate) {
  //     plan.id = update.occurenceId; 
  //   } 
  //   return null;
  //   // return update.isUpdate ? this._planTransactionOccurenceRepo.update(plan) : this._planTransactionOccurenceRepo.create(plan)
  // }


  /**
   * Transforms transaction planner form into Planned Transaction.
   * @param plTransForm: Transaction Planner Form Data
   */
  private _readPlTransFormTransaction(budgetId: string, plTransForm: any): PlannedTransaction
  {
    return {
      name: plTransForm.name,
      type: plTransForm.selectedType,

      budgetId
    };
  }


  deletePlannedTransaction(transaction) {
    this._planTransactionRepo.delete(transaction).subscribe(() => {
      this._logger.log(() => "Transaction has been deleted. Destroying linked transaction occurences ...");
      this._toastService.doSimpleToast("Transaction was delete", 3000); 

      // this.destroyLinkedTransactionOccurences(transaction.plans); 
    }); 
  }

  // private destroyLinkedTransactionOccurences(plans) {
  //   // Map through all the transaction occurrences and delete the ones with the following transaction Id.
  //   plans.forEach(plan => {
  //     this._planTransactionOccurenceRepo.delete(plan).subscribe(() => {
  //       this._logger.log(() => "A transaction Occurence was deleted");
  //     }); 
  //   });
  //   this._logger.log(() => "All linked transaction Occurrences were destroyed");
  // }

  getPlannedTransactions(categoryId: string) {
    return this._planTransactionRepo.getDocuments(new Query().where('type.id', '==', categoryId )); 
  }

  getPlannedTransaction(transactionId: string) {
    return this._planTransactionRepo.getDocumentById(transactionId); 
  }

  getBudgetPlannedTransacitons(budgetId: string) {
    return this._planTransactionRepo.getDocuments(new Query().where('budgetId', '==', budgetId)); 
  }

}
