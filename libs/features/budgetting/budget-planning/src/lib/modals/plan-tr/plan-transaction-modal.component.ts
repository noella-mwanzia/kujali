import { Component, Input, OnInit, Output, EventEmitter, ViewChild, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Observable } from 'rxjs';
import * as _ from 'lodash';

import { PlannedTransaction } from '../../model/planned-transaction.interface';
import { GroupedTransactionType } from '../../../transaction-type-management/model/grouped-transaction-type.interface';

import { PlanTransactionService } from '../../services/plan-transaction.service';
import { TransactionType } from '../../../transaction-type-management/model/transaction-type.interface';
import { TransactionTypeService } from '../../../transaction-type-management/services/transactions-types.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-plan-transaction',
  templateUrl: './plan-transaction.component.html',
  styleUrls: ['../transaction-planner-form.style.scss', './plan-transaction.component.scss'],
})
export class PlanTransactionComponent implements OnInit
{
  @ViewChild('form', { static: true }) form: NgForm;

  model: PlannedTransaction;

  type!: 'cost' | 'income';

  monthFrom!: number;
  yearFrom!: number;

  budgetId!: string;

  categories: Observable<GroupedTransactionType[]>;
  selectedCategory: GroupedTransactionType;
  selectedType: TransactionType;

  amount = 0;
  units = 1; 

  constructor(private _transactionTypeService: TransactionTypeService,
              private _planTransactionService: PlanTransactionService,
              public dialogRef: MatDialogRef<PlanTransactionModalComponent>, 
              @Inject(MAT_DIALOG_DATA) public data: any) 
  { }

  ngOnInit() {
    this.categories = this._transactionTypeService.getTransactionCategoryTypes(this.type); 
  }
 
  exitModal() {
    this.exitModalEvent.emit(false);
  }

  validateName() {
    const value = this.form.value;

    return ! (value.selectedCategory && value.selectedType && value.name);
  }

  saveTransaction(transaction)
  {
    if(!transaction.hasIncrease) {
      transaction.hasIncrease = false; 
    }

    transaction.budgetId = this.budgetId
    
    const planner = this._planTransactionService.planTransaction(transaction);
    this.closeModal(planner);
  }


  onNoClick = () => this.dialogRef.close();
  closeModal = (transactions: Observable<any>) => this.dialogRef.close(transactions); 
}
