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

import { BudgetsPeriodTableComponent } from './components/budgets-period-table/budgets-period-table.component';
import { OperationsBudgetsRouterModule } from './operations-budgets.router';
import { OperationsBudgetsPageComponent } from './pages/operations-budgets-page/operations-budgets-page.component';
import { BudgetPlansQuery } from '@app/state/finance/budgetting/rendering';
import { AllocateInvoiceToLineModalComponent } from './modals/allocate-invoice-to-line-modal/allocate-invoice-to-line-modal.component';

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

    OperationsBudgetsRouterModule,
  ],

  declarations: [
    OperationsBudgetsPageComponent,
    BudgetsPeriodTableComponent,
    AllocateInvoiceToLineModalComponent,
  ],
  providers: [BudgetPlansQuery],
})
export class OperationsBudgetsModule {}
