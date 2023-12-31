import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentsAllocationsStore } from './stores/payments-allocations.store';
import { InvoicesAllocationsStore } from './stores/invoices-allocations.store';

@NgModule({
  imports: [CommonModule],
})
export class AllocationsStateModule {
  static forRoot(): ModuleWithProviders<AllocationsStateModule> {
    return {
      ngModule: AllocationsStateModule,
      providers: [
        PaymentsAllocationsStore,
        InvoicesAllocationsStore
      ]
    };
  }
}