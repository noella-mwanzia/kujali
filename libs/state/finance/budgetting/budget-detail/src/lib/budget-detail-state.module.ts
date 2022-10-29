import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BudgetExplorerActiveBudgetQuery } from './queries/budget-explorer-active-budget.query';
import { BudgetsStateModule } from '@app/state/finance/budgetting/budgets';
import { BudgetRendererService } from './queries/budget-renderer.service';

@NgModule({
  imports: [
    CommonModule,
    BudgetsStateModule
  ],

  providers:[
    BudgetExplorerActiveBudgetQuery,
    BudgetRendererService
  ]
})
/** 
 * This module exports the state which allows inspection of the internals of budgets,
 *    specifically the budget lines and budget calculations such as headers etc.
 */
export class BudgetDetailStateModule {}
