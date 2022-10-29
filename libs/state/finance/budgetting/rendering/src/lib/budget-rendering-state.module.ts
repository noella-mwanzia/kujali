import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BudgetsStateModule } from '@app/state/finance/budgetting/budgets';

import { BudgetRendererService } from './queries/budget-renderer.service';
import { BudgetExplorerActiveBudgetQuery } from './queries/budget-explorer-active-budget.query';
import { BudgetLinesQuery } from './queries/budget-lines.query';

@NgModule({
  imports: [
    CommonModule,
    BudgetsStateModule
  ],

  providers:[
    BudgetExplorerActiveBudgetQuery,
    BudgetLinesQuery,
    BudgetRendererService
  ]
})
/** 
 * This module exports the state which allows inspection of the internals of budgets,
 *    specifically the budget lines and budget calculations such as headers etc.
 */
export class BudgetRenderingStateModule {}
