import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';

import { Observable } from 'rxjs';

import { LoadedTransactionType, LoadedTransactionTypeCategory } from '@app/model/finance/planning/budget-grouping';

// import { GroupedTransactionType } from '../../../transaction-type-management/model/grouped-transaction-type.interface';
// import { TransactionType } from '../../../transaction-type-management/model/transaction-type.interface';

// import { TransactionTypeService } from '../../../transaction-type-management/services/transactions-types.service';

@Component({
  selector: 'app-plan-transaction-name',
  templateUrl: './plan-transaction-name.component.html',
  styleUrls: ['../../shared/transaction-planner-form.style.scss'],
})

export class PlanTransactionNameComponent implements OnInit {

  @Input() pTNameFormGroup: FormGroup;
  @Input() categoryType: 'cost' | 'income';
  @Input() categories: Observable<LoadedTransactionTypeCategory[]>;

  selectedCategory: LoadedTransactionTypeCategory;
  type: LoadedTransactionType;

  viewType: string;
  name: string;

  // TODO Review (IAN <> JENTE)
  
  // constructor(private _transactionTypesService: TransactionTypeService,
  //             private _costTypes$$: CostTypesStore,
  // ) { }

  ngOnInit() {
    // this.categories = this._transactionTypesService.getTransactionCategoryTypes(this.categoryType);
    this.viewType = this.categoryType == 'cost' ? 'Budget' : 'Target';
  }

  categoryChanged(category: MatSelectChange) {
    this.selectedCategory = category.value;
  }
}
