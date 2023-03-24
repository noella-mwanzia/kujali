import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { switchMap, tap, filter } from 'rxjs/operators';

import { Logger } from '@iote/bricks-angular';

import { Repository, DataService } from '@ngfi/angular';
import { DataStore }  from '@ngfi/state';

import { FAccount } from '@app/model/finance/accounts/main';

import { ActiveOrgStore } from "@app/state/organisation";

@Injectable()
export class AccountsTransactionsStore extends DataStore<any>
{
  protected store = 'accounts-trs-store';

  protected _activeRepo: Repository<any>;

  constructor(_activeOrg$$: ActiveOrgStore,
              _dataProvider: DataService,
              protected override _logger: Logger
  ) {
    super('always',  _logger);

    const data$
      = _activeOrg$$.get()
            .pipe(tap(o  => this._activeRepo = !!o ? _dataProvider.getRepo<any>(`orgs/${o.id}/ponto-transactions`) : null as any),
                  switchMap(o => !!this._activeRepo ? this._activeRepo.getDocuments() : of([])));

    this._sbS.sink = data$.subscribe(accountsTrs => {
      this.set(accountsTrs, 'UPDATE - FROM DB');
    });
  }

  override get = () => super.get().pipe(filter((cts, i) => !!cts && cts.length >= 0));
}