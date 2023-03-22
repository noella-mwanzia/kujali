import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountsStore } from './stores/accounts.store';
import { AccountsStateService } from './services/accounts-state.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: []
})
export class BankingStateModule
{
  static forRoot(): ModuleWithProviders<BankingStateModule>
  {
    return {
      ngModule: BankingStateModule,
      providers: [AccountsStore, AccountsStateService]
    };
  }
}