import { Injectable } from "@angular/core";
import { DataService } from "@ngfi/angular";

import { Observable, of, tap, map } from "rxjs";

import { Logger } from "@iote/bricks-angular";

import { Budget } from "@app/model/finance/planning/budgets";
import { TransactionPlan } from "@app/model/finance/planning/budget-items";

/**
 * This service is responsible for rendering budgets by counting up their 
 *  internal lines with their results.
 * 
 * @note This service is used for single use on page load of the budget explorer.
 * @note Should only be imported by BudgetExplorerQuery!
 */
@Injectable()
export class BudgetPlansQuery
{
  constructor(private _logger: Logger,
              private _db: DataService
  ) { }

  /**
   * Gets all the budget lines beloning to a budget.
   * 
   * @param {Budget} budget - The budget to render
   * @returns {RenderedBudget}
   */
  getPlans(budget: Budget): Observable<TransactionPlan[]>
  {
    const repo = this._db.getRepo<TransactionPlan>(`orgs/${budget.orgId}/budgets/${budget.id}/plans`);
    
    // TODO(jrosseel): Add back override functionality
    // const bases = ___concat(budget.overrideList, budget.id);
    
    // return combineLatest(
    //          bases.map(chId => repo.getDocuments(new Query().where('transaction.budgetId', '==', chId)))
    //        )
    return repo.getDocuments();
  }

  savePlans(budget: Budget, plans: TransactionPlan[]) {
    const repo = this._db.getRepo<TransactionPlan>(`orgs/${budget.orgId}/budgets/${budget.id}/plans`);

    plans.forEach((plan: any) => {
      delete plan.type.category;
      delete plan.category.types

      try {
        repo.create(plan as TransactionPlan, plan.id).subscribe()
      } catch (error) {
        this._logger.log(() => `Could not create beacuse ${error}`);
      }
    })
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
