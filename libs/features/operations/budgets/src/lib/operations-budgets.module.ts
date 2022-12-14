import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialDesignModule, MaterialBricksModule, FlexLayoutModule } from '@iote/bricks-angular';

import { UserStateModule } from '@app/state/user';
import { MultiLangModule } from '@ngfi/multi-lang';

import { iTalPageModule } from '@app/elements/layout/page';

import { OperationsBudgetsPageComponent } from './pages/operations-budgets/operations-budgets.page';
import { OperationBudgetsRouterModule } from './operations-budgets-router';
import { BudgetsPeriodTableComponent } from './components/budgets-period-table/budgets-period-table.component';

@NgModule({
  imports: [CommonModule, RouterModule, MultiLangModule,
    MaterialDesignModule, MaterialBricksModule, FlexLayoutModule,
    FormsModule, ReactiveFormsModule,
    UserStateModule,

    iTalPageModule,

    OperationBudgetsRouterModule],

declarations: [
  OperationsBudgetsPageComponent,
  BudgetsPeriodTableComponent
]
})
export class OperationsBudgetsModule {}
