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
    PlanTransactionModalComponent
  ]
})
/** 
 * Module used by the PL planning tool.
 *
 * - Contains the logic to add and edit plans on the transaction planner.
 */
export class BudgetPlanningFeatureModule {}
