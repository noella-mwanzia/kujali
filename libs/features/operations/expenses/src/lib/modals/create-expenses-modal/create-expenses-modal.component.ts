import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Budget } from '@app/model/finance/planning/budgets';
import { BudgetsStore } from '@app/state/finance/budgetting/budgets';
import { CostTypesStore } from '@app/state/finance/cost-types';
import { combineLatest } from 'rxjs';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-create-expenses-modal',
  templateUrl: './create-expenses-modal.component.html',
  styleUrls: ['./create-expenses-modal.component.scss'],
})
export class CreateExpensesModalComponent implements OnInit {

  private _sbS = new SubSink();

  addNewExpenseFormGroup: FormGroup;

  budgetsList: Budget[];
  categories: any;
  types: any;

  activeCategory: any;
  
  constructor(private _fb: FormBuilder,
              private _budgets$$: BudgetsStore,
              private _costTypes$$: CostTypesStore,
    ) {}

  ngOnInit(): void {
    this.addNewExpenseFormGroup = this.buildExpensesForm();

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

  submitExpense() {

  }

  buildExpensesForm(): FormGroup {
    return this._fb.group({
      budget: [''],
      date: [''],
      amount: [0],
      vat: [0],
      category: [''],
      type: [''],
      note: ['']
    })
  }

  categoryChanged(category: MatSelectChange) {
    this.activeCategory = category.value;
    this.types = this.activeCategory.types;
  }
}
