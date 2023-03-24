import { Injectable } from '@angular/core';

import { FAccount } from '@app/model/finance/accounts/main';

import { AccountsStore } from '../stores/accounts.store';
import { ActiveFAccountStore } from '../stores/active-account.store';
import { AccountsTransactionsStore } from '../stores/account-trs.store';

@Injectable({
  providedIn: 'root'
})
export class AccountsStateService {

  constructor(private _accounts$$: AccountsStore,
              private _activeAccount$$: ActiveFAccountStore,
              private _accountsTrs$$: AccountsTransactionsStore
  ) { }

  getFAccounts() {
    return this._accounts$$.get();
  }
  
  createNewAccount(account: FAccount) {
    return this._accounts$$.add((account as FAccount));
  }

  updateAccount(account: FAccount) {
    return this._accounts$$.update(account);
  }

  deleteAccount(account: FAccount) {
    return this._accounts$$.remove(account);
  }

  getActiveFAccount() {
    return this._activeAccount$$.get();
  }

  getAllAccountsTransactions() {
    return this._accountsTrs$$.get();
  }
}
