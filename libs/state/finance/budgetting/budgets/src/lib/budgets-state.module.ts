import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BudgetsStore } from './stores/budgets.store';
import { OrgBudgetsStore } from './stores/org-budgets-store.store';

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
        OrgBudgetsStore
      ]
    };
  }
}
