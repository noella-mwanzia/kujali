import { Injectable } from "@angular/core";
import { Repository } from "@iote/cqrs";
import { DataService } from "@ngfi/angular";

import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";

import { Budget, RenderedBudget } from "@app/model/finance/planning/budgets";
import { BudgetLine } from "@app/model/finance/planning/budget-rendering";
import { ___RenderBudget } from "@app/model/finance/planning/budget-calculation";

/**
 * This service is responsible for rendering budgets by counting up their 
 *  internal lines with their results.
 * 
 * @note This service is used for single use on page load of the budget explorer.
 * @note Should only be imported by BudgetExplorerQuery!
 */
@Injectable()
export class BudgetRendererQuery
{
  private _budgetLines!: Repository<BudgetLine>;

  constructor(private _db: DataService)
  { }

  getRenderedBudget(budget: Budget): Observable<RenderedBudget>
  {
    const repo = this._db.getRepo<BudgetLine>(`orgs/${budget.orgId}/budgets/${budget.id}/lines`);

    // TODO(jrosseel): Add back override functionality
    // const bases = ___concat(budget.overrideList, budget.id);
    
    // return combineLatest(
    //          bases.map(chId => repo.getDocuments(new Query().where('transaction.budgetId', '==', chId)))
    //        )
    return repo.getDocuments()
           .pipe(take(1),
                  //map((budgetLines: BudgetLine[][]) => this._filterOverrides(budgetLines)),
                 map(relevantLines => ___RenderBudget(budget, relevantLines)));
  }

  // TODO(jrosseel): Add back override functionality
  // private _filterOverrides(linesPerBudget: BudgetLine[][]): BudgetLine[]
  // {
  //   const latest: BudgetLine[] = [];
  //                          // Reverse cause current array is from oldest -> newest
  //   for (let budgetColl of linesPerBudget.reverse()) {
  //     for (let line of budgetColl)
  //       // If we can't find line yet in newer budget -> add it to the total budget since it has not been overriden.
  //       if (!_.find(latest, committedLine => committedLine.transaction.id == line.transaction.id))
  //         latest.push(line);
  //   }

  //   return latest;
  // }

}
