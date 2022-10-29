import { Injectable } from "@angular/core";
import { DataService } from "@ngfi/angular";

import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";

import { Budget } from "@app/model/finance/planning/budgets";
import { BudgetLineRow, RenderedBudget } from "@app/model/finance/planning/budget-rendering";
import { __RenderBudget } from "@app/model/finance/planning/budget-calculation";

/**
 * This service is responsible for rendering budgets by counting up their 
 *  internal lines with their results.
 * 
 * @note This service is used for single use on page load of the budget explorer.
 * @note Should only be imported by BudgetExplorerQuery!
 */
@Injectable()
export class BudgetLinesQuery
{
  constructor(private _db: DataService)
  { }

  /**
   * Gets all the budget lines beloning to a budget.
   * 
   * @param {Budget} budget - The budget to render
   * @returns {RenderedBudget}
   */
  get(budget: Budget): Observable<BudgetLineRow[]>
  {
    const repo = this._db.getRepo<BudgetLineRow>(`orgs/${budget.orgId}/budgets/${budget.id}/lines`);

    // TODO(jrosseel): Add back override functionality
    // const bases = ___concat(budget.overrideList, budget.id);
    
    // return combineLatest(
    //          bases.map(chId => repo.getDocuments(new Query().where('transaction.budgetId', '==', chId)))
    //        )
    return repo.getDocuments();
  }

  // TODO(jrosseel): Add back override functionality
  // private _filterOverrides(linesPerBudget: BudgetLineRow[][]): BudgetLineRow[]
  // {
  //   const latest: BudgetLineRow[] = [];
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
