import { Injectable } from '@angular/core';

import { FAccount } from '@app/model/finance/accounts/main';

import { AccountsStore } from '../stores/accounts.store';

@Injectable({
  providedIn: 'root'
})
export class AccountsStateService {

  constructor(private _accounts$$: AccountsStore) { }

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
}
