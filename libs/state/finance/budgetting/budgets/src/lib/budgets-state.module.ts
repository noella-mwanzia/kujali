import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BudgetsStore } from './stores/budgets.store';
import { OrgBudgetsStore } from './stores/org-budgets-store.store';
import { BudgetResultQuery } from './queries/budget-result.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  providers: [
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
