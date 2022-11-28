import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Observable } from 'rxjs';

import { TranslateService } from '@ngfi/multi-lang';

import { BudgetItemFrequency, TransactionPlan } from '@app/model/finance/planning/budget-items';
import { BudgetRowType, LoadedTransactionType, LoadedTransactionTypeCategory } from '@app/model/finance/planning/budget-grouping';

import { CostTypesStore } from '@app/state/finance/cost-types';
import { FinancialExplorerStateService } from '@app/state/finance/budgetting/rendering';

import { CreateTransactionFormGroup } from '../../model/create-transaction-form.model';

@Component({
  selector: 'app-plan-transaction',
  templateUrl: './plan-transaction-modal.component.html',
  styleUrls: ['../../shared/transaction-planner-form.style.scss', './plan-transaction-modal.component.scss'],
})
export class PlanTransactionModalComponent // implements OnInit
{
  plannedTransactionFormGroup!: FormGroup;

  model!: TransactionPlan;
  title: string;
  lblAction: string;
  lblType: string;

  budgetId: string;

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

  constructor(private _fb: FormBuilder,
              private _translation: TranslateService,
              private _costTypes$$: CostTypesStore,
              private _fYExplorer$$: FinancialExplorerStateService,
              private _dialog: MatDialogRef<PlanTransactionModalComponent>, 
              @Inject(MAT_DIALOG_DATA) data: any
  ) 
  {
    this._translation.initialise();
    this.budgetId = data.budgetId as string;

    this.plannedTransactionFormGroup = CreateTransactionFormGroup(_fb);

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

  getFormGroup(formGroup: string): FormGroup {
    return this.plannedTransactionFormGroup.get(formGroup) as FormGroup;
  }

  validateName() {
    const nameForm = this.plannedTransactionFormGroup.get('pTNameFormGroup') as FormGroup;
    return !(nameForm.value.selectedCategory && nameForm.value.selectedType && nameForm.value.name);
  }

  saveTransaction(transactionForm: any)
  {
    const transaciton = this.createTransactionObject(transactionForm);
    
    // Process the changes and recalculate the budget.
    (this.isNewLine || this.isCreate) ? this._fYExplorer$$.addTransaction(transaciton)
                                      : this._fYExplorer$$.updateTransaction(transaciton);

    this.exitModal();
  }

  createTransactionObject(transactionForm: any): TransactionPlan {
    // TODO Review IAN <> JENTE
    let transaciton = {
      ...transactionForm.pTNameFormGroup,
      ...transactionForm.pTValueBaseFormGroup,
      ...transactionForm.pTOccurenceFormGroup,
      ...transactionForm.pTIncreaseFormGroup,
      budgetId: this.budgetId,
      king: false
    }

    if(!transaciton.hasIncrease) {
      transaciton.hasIncrease = false; 
    }
  
    transaciton.frequency = BudgetItemFrequency[transaciton.frequency];
    transaciton.trCatId = transaciton.type.categoryId;
    transaciton.trTypeId = transaciton.type.id;
    transaciton.mode = transaciton.type.type;

    return transaciton;
  }

  onNoClick = () => this.exitModal();

  exitModal  = () => this._dialog.close();
}
