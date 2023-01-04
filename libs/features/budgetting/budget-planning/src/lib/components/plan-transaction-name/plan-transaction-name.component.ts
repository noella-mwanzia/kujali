import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { MatLegacySelectChange as MatSelectChange } from '@angular/material/legacy-select';
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
  @Input() categories$: Observable<LoadedTransactionTypeCategory[]>;

  selectedCategory: LoadedTransactionTypeCategory;
  allCategories: LoadedTransactionTypeCategory[];
  selectedType: LoadedTransactionType;
  allTypes: LoadedTransactionType[];

  // type: LoadedTransactionType;
  viewType: string;
  name: string;

  hasCategory: boolean = false;
  formDataHasLoaded: boolean = false;

  constructor() { }

  ngOnInit() {
    this.viewType = this.categoryType == 'cost' ? 'Budget' : 'Target';

    if (this.categories$) {
      this.categories$.pipe(take(1))
      .subscribe((categories) => {
        let catId = this.pTNameFormGroup.getRawValue().pTNameFormGroup.category;

        this.allCategories = categories;
        this.allTypes = this.allCategories.find((category) => category.id == catId)?.types!;

        this.hasCategory = catId ? true : false;
      })
      this.formDataHasLoaded = true;
    }
  }

  ngAfterViewInit(): void {

  }

  categoryChanged(categoryInput: MatSelectChange) {
    this.selectedCategory = categoryInput.value;
    this.allTypes = this.allCategories.find((category) => category.id == this.selectedCategory.id)?.types!;
    this.hasCategory = true;
  }

  compareCatFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2 : c1 === c2;
  }

  compareTypeFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2 : c1 === c2;
  }
}
