import { HandlerTools } from '@iote/cqrs';
import { FunctionContext, FunctionHandler } from '@ngfi/functions';

import { BudgetHeaderResult } from '@app/model/finance/planning/budget-lines';
import { RenderedBudget } from '@app/model/finance/planning/budget-rendering';
import { TransactionPlan } from '@app/model/finance/planning/budget-items';
import { ___CalculateLocalBudget, ___PlannedTransactionsToBudgetLines, ___RenderBudget } from '@app/model/finance/planning/budget-calculation';
import { Budget } from '@app/model/finance/planning/budgets';
import { Query } from '@ngfi/firestore-qbuilder';

export class BdgtCalculateHeaderOnSaveBudget extends FunctionHandler<{budget: RenderedBudget, plans: TransactionPlan[]}, boolean>
{

  public async execute(budgetData: {budget: RenderedBudget, plans: TransactionPlan[]}, context: FunctionContext, tools: HandlerTools) {

    tools.Logger.log(() => `Starting calculate budget header`);

    let budgetParents = await this.checkIfBudgetHasParent(budgetData.budget, tools);
    
    if (budgetParents && budgetParents.length > 0) {
      tools.Logger.log(() => `Has a parent`);

      let parentIds = budgetParents.map((budget) => budget.id);

      if (parentIds.includes(budgetData.budget.id!)) 
        throw 'This scenario will cause endless loop';
      
      

    } else {
      let scopedResult = this.calculateHeaderResults(budgetData.budget, budgetData.plans, tools);

      await this.saveBudgetHeaders(scopedResult, tools);
    }

    return false;
  }

  private async checkIfBudgetHasParent(budget: Budget, tools: HandlerTools): Promise< Budget[]> {
    tools.Logger.log(() => `Checking if budget has a parent`);

    let budgetsRepo = tools.getRepository<Budget>(`orgs/${budget.orgId}/budgets`);

    let budgets = await budgetsRepo.getDocuments(new Query());

    let budgetParents = budgets.filter((budget) => budget.childrenList.includes(budget.id!));

    return budgetParents;
  }

  private calculateHeaderResults(budget: Budget, plans: TransactionPlan[], tools: HandlerTools): RenderedBudget {
    tools.Logger.log(() => `Calculating header results`);

    const lines = ___PlannedTransactionsToBudgetLines(budget, plans);

    const localBudget = ___CalculateLocalBudget(budget, lines);

    let renderedBudget = ___RenderBudget(budget, [], localBudget);

    return renderedBudget;
  }

  private async saveBudgetHeaders (budget: RenderedBudget, tools: HandlerTools) {
    tools.Logger.log(() => `Calculating header results`);

    let header: BudgetHeaderResult  = {
      id: Math.floor(Date.now() / 1000).toString(),
      orgId: budget.orgId,
      name: budget.name,
      budgetId: budget.id!,
      startY: budget.years[0],
      duration: budget.duration,
      headers: {}
    }
    
    budget.result.amountsYear.forEach((yearValues) => {
      let year = yearValues.year;
      header.headers[year] = yearValues.amountsMonth.map((months) => months.amount);
    })

    let budgetHeaderRepo = tools.getRepository<BudgetHeaderResult>(`orgs/${header.orgId}/budgets/${header.budgetId}/headers`);
    return budgetHeaderRepo.create(header, header.id);
  }
}