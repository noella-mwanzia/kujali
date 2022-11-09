import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _ from 'lodash';

import { TransactionOccurence } from '../../model/transaction-occurence.interface';

import { PlanTransactionService } from '../../services/plan-transaction.service';
import { CellTrOccurenceModalData } from './cell-tr-occurence-modal-data.interface';
import { Frequency } from '../../model/frequency.type';
import { CreateOccurenceForm } from '../../model/create-occurence-form.interface';

@Component({
  selector: 'app-cell-tr-occurrence-modal',
  templateUrl: 'cell-tr-occurrence-modal.component.html',
  styleUrls: ['../transaction-planner-form.style.scss', 'cell-tr-occurrence-modal.component.scss']
})
export class CellTransactionOccurrenceModal
{
  amount: number;
  units = 1;

  monthFrom: number;
  yearFrom: number;
  type: string;
  isUpdate: boolean;

  frequency;
  freqConfig;
  hasIncrease = false;
  increaseFrequency: Frequency; 

  oldOcc: TransactionOccurence;

  amountIncreaseFrequency: Frequency;
  amountIncreaseRate: number;

  constructor(public dialogRef: MatDialogRef<CellTransactionOccurrenceModal>,
    @Inject(MAT_DIALOG_DATA) public data: CellTrOccurenceModalData,
    private _planTransactionService: PlanTransactionService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  closeModal() {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.amount = Math.abs(this.data.amount);
    this.units = this.data.units;
    this.monthFrom = this.data.monthFrom;
    this.yearFrom = this.data.yearFrom;
    this.type = this.data.type;
    this.isUpdate = this.data.update;
    
    this.oldOcc = this.data.occurence;

    this.hasIncrease = this.data.occurence.hasIncrease;
    this.frequency = this.data.occurence.frequency;
  }

  saveTransactionOccurence(form: CreateOccurenceForm, isUpdate: boolean)
  {
    form.isUpdate = isUpdate;
    if (isUpdate)
      form.occurenceId = this.data.occurence.id;

    form.baseTypeMultiplier = this.oldOcc.baseTypeMultiplier;
    form.budgetId = this.oldOcc.budgetId;

    form.hasIncrease = this.hasIncrease;

    form.transactionCategoryId = this.oldOcc.transactionCategoryId;
    form.transactionCategoryName = this.oldOcc.transactionCategoryName;
    form.transactionCategoryOrder = this.oldOcc.transactionCategoryOrder;
    form.transactionCategoryType = this.oldOcc.transactionCategoryType;

    form.transactionId = this.oldOcc.transactionId;
    form.transactionName = this.oldOcc.transactionName;
    form.transactionTypeId = this.oldOcc.transactionTypeId;
    form.transactionTypeName = this.oldOcc.transactionTypeName;

    const planning = this._planTransactionService.planOccurence(form);
    return this.dialogRef.close(planning);
  }

}