import { Injectable } from "@angular/core";

import { Budget } from "@app/model/finance/planning/budgets";
import { TransactionPlan } from "@app/model/finance/planning/budget-items";
import { RenderedBudget, RenderedChildBudget } from "@app/model/finance/planning/budget-rendering";

import { ___CalculateLocalBudget, ___PlannedTransactionsToBudgetLines, ___RenderBudget } from "@app/model/finance/planning/budget-calculation";

/**
 * This service is responsible for rendering budgets by counting up their 
 *  internal lines with their results.
 * 
 * @note This service should be called whenever budget state changes (plans, children, overrides, ...) added
 *          to properly calculate the budget.
 */
@Injectable()
export class BudgetRendererService
{
  /**
   * Renders a budget by transforming the budget details into a fully calculated 2D array.
   * 
   * @param {Budget} budget     - The budget to render.
   * @param {TransactionPlan[]} - All plans the user has for the budget.
   * @returns {RenderedBudget}
   */
  render(budget: Budget, children: RenderedChildBudget[], plans: TransactionPlan[]): RenderedBudget
  {
    const lines = ___PlannedTransactionsToBudgetLines(budget, plans);
 
    const localBudget = ___CalculateLocalBudget(budget, lines);

    return ___RenderBudget(budget, children, localBudget);
  }

    // const repo = this._db.getRepo<BudgetLineRow>(`orgs/${budget.orgId}/budgets/${budget.id}/lines`);

    // TODO(jrosseel): Add back override functionality
    // const bases = ___concat(budget.overrideList, budget.id);
    
    // return combineLatest(
    //          bases.map(chId => repo.getDocuments(new Query().where('transaction.budgetId', '==', chId)))
    //        )
    // return repo.getDocuments()
    //        .pipe(take(1),
    //               //map((budgetLines: BudgetLineRow[][]) => this._filterOverrides(budgetLines)),
    //              map(relevantLines => ___RenderBudget(budget, relevantLines)));

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
