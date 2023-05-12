import { Injectable } from "@angular/core";

import { of } from "rxjs";
import { filter, switchMap, tap } from "rxjs/operators";

import { orderBy as ___orderBy, includes as ___includes } from 'lodash';

import { Logger } from "@iote/bricks-angular";
import { DataService, Repository } from "@ngfi/angular";

import { Organisation } from "@app/model/organisation";
import { BudgetLinesAllocation } from "@app/model/finance/planning/budgets";

import { ActiveOrgStore } from "@app/state/organisation";
import { DataStore } from "@ngfi/state";

@Injectable()
export class BudgetLinesAllocsStore extends DataStore<BudgetLinesAllocation>
{
  private _org!: Organisation;
  protected _activeRepo!: Repository<BudgetLinesAllocation>;
  protected store: string = 'budget-lines-allocs-store'; 

  constructor(org$$: ActiveOrgStore,
              dataService: DataService,
              _logger: Logger
  ) {
    super('always', _logger);

    const data$ = org$$.get()
            .pipe(tap((o)  => 
                      this._activeRepo = !!o ? dataService.getRepo<BudgetLinesAllocation>(`orgs/${o.id}/budget-lines-allocs`) 
                                                    : null as any),
                  switchMap(o => !!this._activeRepo ? this._activeRepo.getDocuments() : of([])));

    this._sbS.sink = data$.subscribe(budgetLinesAllocs => {
      this.set(budgetLinesAllocs, 'UPDATE - FROM DB');
    });
  }

  override get = () => super.get().pipe(filter(bs => !!bs));
}
