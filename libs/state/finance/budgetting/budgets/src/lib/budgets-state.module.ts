import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BudgetsStore } from './stores/budgets.store';
import { OrgBudgetsStore } from './stores/org-budgets-store.store';

import { BudgetResultQuery } from './queries/budget-result.query';
import { BudgetExplorerActiveBudgetQuery } from './queries/budget-explorer-active-budget.query';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  providers: [
    BudgetExplorerActiveBudgetQuery,
    BudgetResultQuery
  ]
})
export class BudgetsStateModule 
{ 
  static forRoot(): ModuleWithProviders<BudgetsStateModule>
  {
    return {
      ngModule: BudgetsStateModule,
      providers: [
        BudgetsStore, 
        OrgBudgetsStore
      ]
    };
  }
}
