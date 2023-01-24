import { HandlerTools } from '@iote/cqrs';
import { FunctionContext, FunctionHandler } from '@ngfi/functions';

import { BudgetHeaderResult } from '@app/model/finance/planning/budget-lines';
import { RenderedBudget } from '@app/model/finance/planning/budget-rendering';
import { TransactionPlan } from '@app/model/finance/planning/budget-items';
import { ___CalculateLocalBudget, ___PlannedTransactionsToBudgetLines, ___RenderBudget } from '@app/model/finance/planning/budget-calculation';
import { Budget } from '@app/model/finance/planning/budgets';
import { Query } from '@ngfi/firestore-qbuilder';
import { __PubSubPublishAction } from '@app/functions/pubsub';

let BUDGET_PARENTS: Budget[] = [];
let BUDGET_PARENTS_IDS: string[] = [];

export class BdgtCalculateHeaderOnSaveBudget extends FunctionHandler<{budget: RenderedBudget, plans: TransactionPlan[]}, boolean>
{

  public async execute(budgetData: {budget: RenderedBudget, plans: TransactionPlan[]}, context: FunctionContext, tools: HandlerTools) {

    tools.Logger.log(() => `Starting calculate budget header`);

    BUDGET_PARENTS = await this.checkIfBudgetHasParent(budgetData.budget, tools);
    
    if (BUDGET_PARENTS && BUDGET_PARENTS.length > 0) {
      tools.Logger.log(() => `Has a parent(s)`);

      BUDGET_PARENTS_IDS = BUDGET_PARENTS.map((budget) => budget.id!);

      if (BUDGET_PARENTS_IDS.includes(budgetData.budget.id!)) 
        throw 'This scenario will cause endless loop';
       
    }

    let scopedResult = this.calculateHeaderResults(budgetData.budget, budgetData.plans, tools);
    await this.saveBudgetHeaders(scopedResult, tools);

    return false;
  }

  private async checkIfBudgetHasParent(budget: Budget, tools: HandlerTools): Promise< Budget[]> {
    tools.Logger.log(() => `Checking if budget has a parent`);

    let budgetsRepo = tools.getRepository<Budget>(`orgs/${budget.orgId}/budgets`);

    let budgets = await budgetsRepo.getDocuments(new Query().where('childrenList', 'array-contains', budget.id));

    return budgets;
  }

  private calculateHeaderResults(budget: Budget, plans: TransactionPlan[], tools: HandlerTools): RenderedBudget {
    tools.Logger.log(() => `Calculating header results`);

    const lines = ___PlannedTransactionsToBudgetLines(budget, plans);

    const localBudget = ___CalculateLocalBudget(budget, lines);

    let renderedBudget = ___RenderBudget(budget, [], localBudget);

    return renderedBudget;
  }

  private async saveBudgetHeaders (budget: RenderedBudget, tools: HandlerTools) {
    tools.Logger.log(() => `saving header results`);

    let header: BudgetHeaderResult  = {
      id: Math.floor(Date.now() / 1000).toString(),
      orgId: budget.orgId,
      name: budget.name,
      budgetId: budget.id!,
      startY: budget.years[0],
      duration: budget.duration,
      headers: {},
      years: budget.years
    }
    
    budget.result.amountsYear.forEach((yearValues) => {
      let year = yearValues.year;
      header.headers[year] = yearValues.amountsMonth.map((months) => months.amount);
    })

    let budgetHeaderRepo = tools.getRepository<BudgetHeaderResult>(`orgs/${header.orgId}/budgets/${header.budgetId}/headers`);
    await budgetHeaderRepo.create(header, header.id);

    if (BUDGET_PARENTS_IDS.length > 0) {

      tools.Logger.log(() => `updating parent header results`);

      BUDGET_PARENTS_IDS.map(async (id) => {

        let headerValue = {
          orgId: header.orgId, 
          parentBudgetId: id, 
          childHeaderResult: header
        }

        await this._calculateParentBudgetHeaders(headerValue, tools);
      })
    }

    return true;
  }

  private async _calculateParentBudgetHeaders(headerValues: {orgId: string, parentBudgetId: string, childHeaderResult: BudgetHeaderResult}, tools: HandlerTools)
  {
    tools.Logger.log(() => `Triggering parent budget headers recalculation for ${headerValues.parentBudgetId}`);
    await __PubSubPublishAction<any>('bdgtCalculateHeaderPubSub', headerValues);
  }
}