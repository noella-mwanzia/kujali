import { Injectable } from "@angular/core";
import { DataService } from "@ngfi/angular";

import { map, Observable } from "rxjs";

import { Query } from "@ngfi/firestore-qbuilder";

import { Budget } from "@app/model/finance/planning/budgets";
import { AggregatedBudget, RenderedBudget, RenderedChildBudget } from "@app/model/finance/planning/budget-rendering";

import { BudgetResult } from "@app/model/finance/planning/budget-lines";

import { ___CalculateLocalBudget, ___PlannedTransactionsToBudgetLines, ___RenderBudget } from "@app/model/finance/planning/budget-calculation";
import { TransactionPlan } from "@app/model/finance/planning/budget-items";

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
  constructor(private _db: DataService)
  { }

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

  /**
   * Method which gets budget children from a list of children as configured on the budget.
   * 
   * @param b - Budget which contains the childrenList
   * @returns List of rendered children, which can be interpreted by the parent budget.
   */
  public getBudgetChildren$(b: Budget): Observable<RenderedChildBudget[]>
  {
    const childBudgetQ = new Query().where('id', 'in', b.childrenList);

    return this._db.getRepo<BudgetResult>(`orgs/${b.orgId}/budgets`)
                   .getDocuments(childBudgetQ)
      .pipe(
        map(chBs => chBs.map(chB => ({
          id: chB.id as string,
          name: chB.name,
          header: chB.balance
        }))));
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
