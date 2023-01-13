import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialDesignModule, MaterialBricksModule, FlexLayoutModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { UserStateModule } from '@app/state/user';
import { OperationBudgetsQuery } from '@app/state/finance/budgetting/rendering';

import { iTalPageModule } from '@app/elements/layout/page';

import { BudgetsPeriodTableComponent } from './components/budgets-period-table/budgets-period-table.component';
import { OperationsBudgetsPageComponent } from './pages/operations-budgets/operations-budgets.page';

import { OperationBudgetsRouterModule } from './operations-budgets-router';
import { BudgetPlansQuery } from 'libs/state/finance/budgetting/rendering/src/lib/queries/budget-lines.query';

@NgModule({
imports: [
  CommonModule, RouterModule, MultiLangModule,
  MaterialDesignModule, MaterialBricksModule, FlexLayoutModule,
  FormsModule, ReactiveFormsModule,
  UserStateModule,

  iTalPageModule,

  OperationBudgetsRouterModule
],

declarations: [
  OperationsBudgetsPageComponent,
  BudgetsPeriodTableComponent
],
providers: [OperationBudgetsQuery, BudgetPlansQuery]
})
export class OperationsBudgetsModule {}
