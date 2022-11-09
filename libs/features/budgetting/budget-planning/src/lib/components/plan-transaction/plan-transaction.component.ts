import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Observable } from 'rxjs';
import * as _ from 'lodash';

import { PlannedTransaction } from '../../model/planned-transaction.interface';
import { GroupedTransactionType } from '../../../transaction-type-management/model/grouped-transaction-type.interface';

import { PlanTransactionService } from '../../services/plan-transaction.service';
import { TransactionType } from '../../../transaction-type-management/model/transaction-type.interface';
import { TransactionTypeService } from '../../../transaction-type-management/services/transactions-types.service';

@Component({
  selector: 'app-plan-transaction',
  templateUrl: './plan-transaction.component.html',
  styleUrls: ['../transaction-planner-form.style.scss', './plan-transaction.component.scss'],
})
export class PlanTransactionComponent implements OnInit
{
  @ViewChild('form', { static: true }) form: NgForm;

  model: PlannedTransaction;

  @Input() type: 'cost' | 'income';

  @Input() monthFrom: number;
  @Input() yearFrom: number;

  @Input() budgetId: string;

  @Output() closeModalEvent = new EventEmitter<Observable<any>>(); 
  @Output() exitModalEvent = new EventEmitter();

  categories: Observable<GroupedTransactionType[]>;
  selectedCategory: GroupedTransactionType;
  selectedType: TransactionType;

  amount = 0;
  units = 1; 

  constructor(private _transactionTypeService: TransactionTypeService,
              private _planTransactionService: PlanTransactionService) 
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
    this.closeModalEvent.emit(planner);
  }
}
