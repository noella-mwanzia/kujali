import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpensesStore } from './stores/expenses.store';
import { ExpensesAllocsStore } from './stores/expenses-allocs.store';

import { ExpensesStateService } from './services/expenses-state.service';

@NgModule({
  imports: [CommonModule],
})
export class ExpensesStateModule {
  static forRoot(): ModuleWithProviders<ExpensesStateModule> {
    return {
      ngModule: ExpensesStateModule,
      providers: [
        ExpensesStateService,
        ExpensesStore,
        ExpensesAllocsStore
      ]
    };
  }
}
