import { Component, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';

import { Observable } from 'rxjs';

import { TransactionPlan } from '@app/model/finance/planning/budget-items';
import { BudgetRowType, LoadedTransactionType, LoadedTransactionTypeCategory } from '@app/model/finance/planning/budget-grouping';

import { CostTypesStore } from '@app/state/finance/cost-types';

import { PlanTrInput } from './plan-tr-input.interface';
import { FinancialExplorerStateService } from '@app/state/finance/budgetting/rendering';
import { CreateTransactionForm } from '../../model/create-transaction-form.interface';


@Component({
  selector: 'app-plan-transaction',
  templateUrl: './plan-transaction-modal.component.html',
  styleUrls: ['../../shared/transaction-planner-form.style.scss', './plan-transaction-modal.component.scss'],
})
export class PlanTransactionModalComponent // implements OnInit
{
  @ViewChild('form', { static: true }) form!: NgForm;

  model!: TransactionPlan;
  title: string;
  lblAction: string;
  lblType: string;

  /** Master type of the planned transaction */
  type!: BudgetRowType.CostLine | BudgetRowType.IncomeLine;
  isCreate!: boolean;

  monthFrom!: number;
  yearFrom!: number;

  budgetId!: string;

  categories!: Observable<LoadedTransactionTypeCategory[]>;
  selectedCategory!: LoadedTransactionTypeCategory;
  selectedType!    : LoadedTransactionType;

  amount = 0;
  units  = 1; 

  constructor(private _costTypes$$: CostTypesStore,
              private _fYExplorer$$: FinancialExplorerStateService,
              private _dialog: MatDialogRef<PlanTransactionModalComponent>, 
              
              @Inject(MAT_DIALOG_DATA) data: PlanTrInput) 
  {
    this.type = data.type;
    this.categories = this._costTypes$$.getOfType(this.type); 

    this.isCreate = !!data.tr;
    this.lblAction = this.isCreate ? 'PL-EXPLORER.TRPLANNER.ACTION-CREATE' 
                                   : 'PL-EXPLORER.TRPLANNER.ACTION-UPDATE';

    this.title  = this.type === BudgetRowType.CostLine ? 'PL-EXPLORER.TRPLANNER.TITLE-COST' 
                                                       : 'PL-EXPLORER.TRPLANNER.TITLE-INCOME';
    this.lblType = this.type === BudgetRowType.CostLine ? 'PL-EXPLORER.TRPLANNER.COST-TYPE' 
                                                        : 'PL-EXPLORER.TRPLANNER.INCOME-TYPE';
  }

  validateName() {
    const value = this.form.value;

    return ! (value.selectedCategory && value.selectedType && value.name);
  }

  saveTransaction(form: CreateTransactionForm)
  {
    if(!form.hasIncrease) {
      form.hasIncrease = false; 
    }

    //
    // TODO(Ian): Fix subforms and convert form to PlannedTransaction
    //

    form.budgetId = this.budgetId;
    
    // Process the changes and recalculate the budget
    this.isCreate ? this._fYExplorer$$.addTransaction(transaction)
                  : this._fYExplorer$$.updateTransaction(transaction);

    this.exitModal();
  }

  onNoClick = () => this.exitModal();

  exitModal  = () => this._dialog.close();
}
