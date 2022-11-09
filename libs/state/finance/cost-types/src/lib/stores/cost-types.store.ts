import { Injectable } from "@angular/core";
import { filter, map, of } from "rxjs";

import { Store } from "@iote/state";

import { Logger } from "@iote/bricks-angular";

import { BudgetRowType, DEFAULT_COST_CATEGORIES, LoadedTransactionTypeCategory } from "@app/model/finance/planning/budget-grouping";


/**
 * Store which manages the available cost types on the platform.
 * 
 * TODO: Manage these dynamically
 */
@Injectable()
export class CostTypesStore extends Store<LoadedTransactionTypeCategory[]>
{
  protected store = 'cost-types-store';

  constructor(// org$$: ActiveOrgStore,
              // dataService: DataService,
              _logger: Logger)
  {
    super(DEFAULT_COST_CATEGORIES);

    of(DEFAULT_COST_CATEGORIES)
      .subscribe(cts => {
        this.set(cts, 'FROM CONST');
      });
  }

  /** Get cost types of a specific master type (cost || income) */
  getOfType = (type: BudgetRowType) => this.get()
      .pipe(map(cs => cs.filter(c => c.type === type)));
}
