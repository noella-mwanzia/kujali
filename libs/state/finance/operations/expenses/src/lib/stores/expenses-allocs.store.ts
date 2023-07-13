import { Injectable } from "@angular/core";

import { of } from "rxjs";
import { filter, switchMap, tap } from "rxjs/operators";

import { orderBy as ___orderBy, includes as ___includes } from 'lodash';

import { Logger } from "@iote/bricks-angular";
import { DataService, Repository } from "@ngfi/angular";
import { DataStore } from "@ngfi/state";

import { ActiveOrgStore } from "@app/state/organisation";
import { ExpenseAllocs, ExpensesAllocation } from "@app/model/finance/operations/expenses";

@Injectable()
export class ExpensesAllocsStore extends DataStore<ExpensesAllocation>
{
  protected _activeRepo!: Repository<ExpensesAllocation>;
  protected store: string = 'expenses-allocs-store'; 

  constructor(org$$: ActiveOrgStore,
              dataService: DataService,
              _logger: Logger
  ) {
    super('always', _logger);

    const data$ = org$$.get()
            .pipe(tap((o)  => 
                      this._activeRepo = !!o ? dataService.getRepo<ExpensesAllocation>(`orgs/${o.id}/expenses-allocs`) 
                                                    : null as any),
                  switchMap(o => !!this._activeRepo ? this._activeRepo.getDocuments() : of([])));

    this._sbS.sink = data$.subscribe(expensesAllocs => {
      this.set(expensesAllocs, 'UPDATE - FROM DB');
    });
  }

  override get = () => super.get().pipe(filter(bs => !!bs));
}
