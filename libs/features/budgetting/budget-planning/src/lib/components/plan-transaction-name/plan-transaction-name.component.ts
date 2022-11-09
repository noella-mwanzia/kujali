import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

import { Observable } from 'rxjs';

import { GroupedTransactionType } from '../../../transaction-type-management/model/grouped-transaction-type.interface';
import { TransactionType } from '../../../transaction-type-management/model/transaction-type.interface';

import { TransactionTypeService } from '../../../transaction-type-management/services/transactions-types.service';

@Component({
  selector: 'app-plan-transaction-name',
  templateUrl: './plan-transaction-name.component.html',
  styleUrls: ['../transaction-planner-form.style.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class PlanTransactionNameComponent implements OnInit {

  @Input() categoryType: 'cost' | 'income';
  viewType: string;

  name: string;

  categories: Observable<GroupedTransactionType[]>;
  selectedCategory: GroupedTransactionType;
  type: TransactionType;

  constructor(private _transactionTypesService: TransactionTypeService) { }

  ngOnInit() {
    this.categories = this._transactionTypesService.getTransactionCategoryTypes(this.categoryType);

    this.viewType = this.categoryType == 'cost' ? 'Budget' : 'Target';
  }
}
