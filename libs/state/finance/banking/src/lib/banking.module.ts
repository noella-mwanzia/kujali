import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountsStore } from './stores/accounts.store';
import { ActiveFAccountStore } from './stores/active-account.store';

import { AccountsStateService } from './services/accounts-state.service';
import { AccountsTransactionsStore } from './stores/account-trs.store';
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
      providers: [AccountsStore, ActiveFAccountStore, AccountsTransactionsStore, AccountsStateService]
    };
  }
}