import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BudgetsStateModule } from '@app/state/finance/budgetting/budgets';

import { BudgetQuery } from './queries/budget.query';
import { BudgetPlansQuery } from './queries/budget-lines.query';
import { BudgetLockQuery } from './queries/budget-lock.query';

import { BudgetRendererService } from './queries/budget-renderer.service';
import { FinancialExplorerStateService } from './budget-explorer-state.service';
import { BudgetLockService } from './services/budget-lock.service';
import { CalculateBudgetHeaderService } from './services/calculate-budget-header.service';

@NgModule({
  imports: [
    CommonModule,
    BudgetsStateModule
  ],

  providers:[
    BudgetQuery,
    BudgetPlansQuery,
    BudgetLockQuery,

    BudgetLockService,
    BudgetRendererService,
    FinancialExplorerStateService,
    CalculateBudgetHeaderService
  ]
})
/** 
 * This module exports the state which allows inspection of the internals of budgets,
 *    specifically the budget lines and budget calculations such as headers etc.
 */
export class BudgetRenderingStateModule {}
