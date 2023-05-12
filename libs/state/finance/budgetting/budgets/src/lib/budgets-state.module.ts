import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BudgetsStore } from './stores/budgets.store';
import { OrgBudgetsStore } from './stores/org-budgets-store.store';
import { ActiveBudgetStore } from './stores/active-budget.store';
import { BudgetHeaderResultStore } from './stores/budget-header-result.store';
import { BudgetLinesStore } from './stores/budget-lines.store';
import { BudgetLinesAllocsStore } from './stores/budget-lines-allocs.store';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
})

export class BudgetsStateModule 
{ 
  static forRoot(): ModuleWithProviders<BudgetsStateModule>
  {
    return {
      ngModule: BudgetsStateModule,
      providers: [
        BudgetsStore, 
        OrgBudgetsStore,
        ActiveBudgetStore,
        BudgetHeaderResultStore,
        BudgetLinesStore,
        BudgetLinesAllocsStore
      ]
    };
  }
}
