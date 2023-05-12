import { Injectable } from "@angular/core";

import { combineLatest, of } from "rxjs";
import { filter, switchMap, tap } from "rxjs/operators";

import { orderBy as ___orderBy, includes as ___includes } from 'lodash';

import { Logger } from "@iote/bricks-angular";
import { DataService, Repository } from "@ngfi/angular";
import { DataStore } from "@ngfi/state";

import { Organisation } from "@app/model/organisation";
import { BudgetHeaderResult } from "@app/model/finance/planning/budget-lines";

import { ActiveOrgStore } from "@app/state/organisation";

import { ActiveBudgetStore } from "./active-budget.store";

@Injectable()
export class BudgetHeaderResultStore extends DataStore<BudgetHeaderResult>
{
  private _org!: Organisation;
  protected _activeRepo!: Repository<BudgetHeaderResult>;
  protected store: string = 'budget-header-result-store'; 

  constructor(org$$: ActiveOrgStore,
              dataService: DataService,
              activeBudget$$: ActiveBudgetStore,
              _logger: Logger
  ) {
    super('always', _logger);

    const data$
      = combineLatest([org$$.get(), activeBudget$$.get()])
            .pipe(tap(([o, b])  => 
                      this._activeRepo = !!o && !!b ? dataService.getRepo<BudgetHeaderResult>(`orgs/${o.id}/budgets/${b.id}/headers`) 
                                                    : null as any),
                  switchMap(o => !!this._activeRepo ? this._activeRepo.getDocuments() : of([])));

    this._sbS.sink = data$.subscribe(budgetHeaderResult => {
      this.set(budgetHeaderResult, 'UPDATE - FROM DB');
    });
  }

  override get = () => super.get().pipe(filter(bs => !!bs));
}
