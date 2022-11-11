import { Component, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';

import { Observable } from 'rxjs';

import { PlanTrInput, TransactionPlan } from '@app/model/finance/planning/budget-items';
import { BudgetRowType, LoadedTransactionType, LoadedTransactionTypeCategory } from '@app/model/finance/planning/budget-grouping';

import { CostTypesStore } from '@app/state/finance/cost-types';

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
  // type!: BudgetRowType.CostLine | BudgetRowType.IncomeLine;
  type!: any;
  
  /** Mode 1 : A new line is being created through this modal. */
  isNewLine!: boolean;
  /** Mode 2 : A new occurence is being added to an existing line. */
  isCreate! : boolean;
  /** Mode 3 : An existing occurence is being edited. */
  isEdit!   : boolean;

  /** Month from which the transaction should start - Can be edited */
  monthFrom!: number;
  /** Year in which the transaction should start    - Can be edited */
  yearFrom!: number;

  /** All cost categories which can be selected. */
  categories!: Observable<LoadedTransactionTypeCategory[]>;

  /** Selected cost category */
  selectedCategory!: LoadedTransactionTypeCategory;
  /** Selected cost/row type */
  selectedType!    : LoadedTransactionType;

  /** Line amount */
  amount = 0;
  /** Line units */
  units  = 1; 

  constructor(private _costTypes$$: CostTypesStore,
              private _fYExplorer$$: FinancialExplorerStateService,
              private _dialog: MatDialogRef<PlanTransactionModalComponent>, 
              
              @Inject(MAT_DIALOG_DATA) data: PlanTrInput) 
  {
    const cmd = this._fYExplorer$$.loadTransactionPlannerData(data);

    this.type = cmd.type;
    this.categories = this._costTypes$$.getOfType(this.type); 

    this.isNewLine = !!cmd.tr;
    this.isCreate  = !this.isNewLine && cmd.trMode === 'create';
    this.isEdit    = !this.isNewLine && !this.isCreate;

    this.lblAction = this.isNewLine ? 'PL-EXPLORER.TRPLANNER.ACTION-CREATE' 
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

    // form.budgetId = this.budgetId;
    
    // Process the changes and recalculate the budget. 
    // (this.isNewLine || this.isCreate) ? this._fYExplorer$$.addTransaction(transaction)
    //                                   : this._fYExplorer$$.updateTransaction(transaction);

    this.exitModal();
  }

  onNoClick = () => this.exitModal();

  exitModal  = () => this._dialog.close();
}
