import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MultiLangModule } from '@ngfi/multi-lang';
import { FlexLayoutModule, MaterialBricksModule, MaterialDesignModule } from '@iote/bricks-angular';

import { UserStateModule } from '@app/state/user';
import { BudgetsStateModule } from '@app/state/finance/budgetting/budgets';
import { BudgetRenderingStateModule } from '@app/state/finance/budgetting/rendering';

import { iTalPageModule } from '@app/elements/layout/page';

import { PlanTransactionModalComponent } from './modals/plan-tr/plan-transaction-modal.component';
import { PlanTransactionOccurenceComponent } from './components/plan-transaction-occurence/plan-transaction-occurence.component';
import { PlanTransactionIncreaseComponent } from './components/plan-transaction-increase/plan-transaction-increase.component';
import { PlanTransactionValueBaseAmountComponent } from './components/plan-transaction-value-base-amount/plan-transaction-value-base-amount.component';
import { PlanTransactionNameComponent } from './components/plan-transaction-name/plan-transaction-name.component';

@NgModule({
  imports: [
    CommonModule, RouterModule, MultiLangModule,
    MaterialDesignModule, MaterialBricksModule, FlexLayoutModule,
    FormsModule, ReactiveFormsModule,
    UserStateModule,

    iTalPageModule,

    BudgetsStateModule,
    BudgetRenderingStateModule
  ],  
  declarations: [
    PlanTransactionModalComponent, PlanTransactionOccurenceComponent,
    PlanTransactionIncreaseComponent, PlanTransactionValueBaseAmountComponent,
    PlanTransactionNameComponent
  ],
  exports: [
    PlanTransactionModalComponent
  ]
})
/** 
 * Module used by the PL planning tool.
 *
 * - Contains the logic to add and edit plans on the transaction planner.
 */
export class BudgetPlanningFeatureModule {}
