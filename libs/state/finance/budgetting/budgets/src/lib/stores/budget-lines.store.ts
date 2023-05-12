import { Injectable } from "@angular/core";

import { of } from "rxjs";
import { filter, switchMap, tap } from "rxjs/operators";

import { orderBy as ___orderBy, includes as ___includes } from 'lodash';

import { Logger } from "@iote/bricks-angular";
import { DataService, Repository } from "@ngfi/angular";

import { Organisation } from "@app/model/organisation";
import { BudgetHeaderResult } from "@app/model/finance/planning/budget-lines";
import { BudgetLine } from "@app/model/finance/planning/budgets";

import { ActiveOrgStore } from "@app/state/organisation";
import { DataStore } from "@ngfi/state";

@Injectable()
export class BudgetLinesStore extends DataStore<BudgetLine>
{
  private _org!: Organisation;
  protected _activeRepo!: Repository<BudgetLine>;
  protected store: string = 'budget-lines-store'; 

  constructor(org$$: ActiveOrgStore,
              dataService: DataService,
              _logger: Logger
  ) {
    super('always', _logger);

    const data$ = org$$.get()
            .pipe(tap((o)  => 
                      this._activeRepo = !!o ? dataService.getRepo<BudgetLine>(`orgs/${o.id}/budget-lines`) 
                                                    : null as any),
                  switchMap(o => !!this._activeRepo ? this._activeRepo.getDocuments() : of([])));

    this._sbS.sink = data$.subscribe(budgetLines => {
      this.set(budgetLines, 'UPDATE - FROM DB');
    });
  }

  override get = () => super.get().pipe(filter(bs => !!bs));
}
