import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { FormGroup } from '@angular/forms';

import { map, Observable, tap } from 'rxjs';

import { LoadedTransactionType, LoadedTransactionTypeCategory } from '@app/model/finance/planning/budget-grouping';
import { take } from 'rxjs';

@Component({
  selector: 'app-plan-transaction-name',
  templateUrl: './plan-transaction-name.component.html',
  styleUrls: ['../../shared/transaction-planner-form.style.scss'],
})

export class PlanTransactionNameComponent implements OnInit, AfterViewInit {

  @Input() pTNameFormGroup: FormGroup;
  @Input() categoryType: 'cost' | 'income';
  @Input() categories: Observable<LoadedTransactionTypeCategory[]>;

  selectedCategory: LoadedTransactionTypeCategory;
  type: LoadedTransactionType;

  viewType: string;
  name: string;

  hasCategory: boolean = false;

  constructor() { }

  ngOnInit() {
    this.viewType = this.categoryType == 'cost' ? 'Budget' : 'Target';
  }

  ngAfterViewInit(): void {
    if (this.categories) {
      let catId = this.pTNameFormGroup.getRawValue().pTNameFormGroup.category;
      if (catId) {
        this.categories.pipe(take(1))
        .subscribe((cats) => {
          this.selectedCategory = cats.find((cat) => cat.id === catId)!;
          this.hasCategory = true
        })
      }
    }
  }

  categoryChanged(category: MatSelectChange) {
    this.selectedCategory = category.value;
    this.hasCategory = true;
  }

  compareCateFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.types.id === c2.id : c1.types === c2;
  }

  compareTypesFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.types === c2.id : c1.types === c2;
  }
}
