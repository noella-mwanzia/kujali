import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  MaterialDesignModule,
  MaterialBricksModule,
  FlexLayoutModule,
} from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { iTalPageModule } from '@app/elements/layout/page';

import { ExpensesPageComponent } from './pages/expenses-page/expenses-page.component';

import { OperationsExpensesRouterModule } from './operations-expenses-router';
import { CreateExpensesModalComponent } from './modals/create-expenses-modal/create-expenses-modal.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MultiLangModule,
    MaterialDesignModule,
    MaterialBricksModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,

    iTalPageModule,

    OperationsExpensesRouterModule,
  ],
  declarations: [ExpensesPageComponent, CreateExpensesModalComponent],
})
export class OperationsExpensesModule {}
