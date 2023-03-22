import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';

import { SubSink } from 'subsink';
import { combineLatest } from 'rxjs';

import { Budget } from '@app/model/finance/planning/budgets';

import { BudgetsStore } from '@app/state/finance/budgetting/budgets';
import { CostTypesStore } from '@app/state/finance/cost-types';
import { CreateNewBankAccountForm } from '../../providers/create-new-bank-account-form.function';

@Component({
  selector: 'app-create-new-bank-account-modal',
  templateUrl: './create-new-bank-account-modal.component.html',
  styleUrls: ['./create-new-bank-account-modal.component.scss'],
})
export class CreateNewBankAccountModalComponent implements OnInit {

  private _sbS = new SubSink();

  addNewBankAccountFormGroup: FormGroup;

  budgetsList: Budget[];
  categories: any;
  types: any;

  activeCategory: any;
  
  constructor(private _fb: FormBuilder,
              private _budgets$$: BudgetsStore,
              private _costTypes$$: CostTypesStore,
    ) {}

  ngOnInit(): void {
    this.addNewBankAccountFormGroup = CreateNewBankAccountForm(this._fb);

    this.getModalData();
  }

  getModalData() {
    this._sbS.sink = combineLatest([this._budgets$$.get(), this._costTypes$$.getOfType(1)]).subscribe(([budgets, costTypes]) => {
      if (budgets) {
        this.budgetsList = budgets
        this.categories = costTypes;
      }
    })
  }

  categoryChanged(category: MatSelectChange) {
    this.activeCategory = category.value;
    this.types = this.activeCategory.types;
  }

  createBankAccount() {

  }
}
