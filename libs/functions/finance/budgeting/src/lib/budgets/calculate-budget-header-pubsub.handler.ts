import { HandlerTools } from '@iote/cqrs';
import { FunctionContext, FunctionHandler } from '@ngfi/functions';

import { BudgetHeaderResult } from '@app/model/finance/planning/budget-lines';
import { RenderedBudget } from '@app/model/finance/planning/budget-rendering';
import { TransactionPlan } from '@app/model/finance/planning/budget-items';
import { ___CalculateLocalBudget, ___PlannedTransactionsToBudgetLines, ___RenderBudget } from '@app/model/finance/planning/budget-calculation';
import { Budget } from '@app/model/finance/planning/budgets';
import { Query } from '@ngfi/firestore-qbuilder';
import { __PubSubPublishAction } from '@app/functions/pubsub';

const BUDGETS_REPO_PATH = (orgId: string) : string =>  {return `orgs/${orgId}/budgets`};
const BUDGETS_HEADERS_REPO_PATH = (orgId: string, budgetId) : string =>  {return `orgs/${orgId}/budgets/${budgetId}/headers`};
const PLANS_REPO_PATH = (orgId: string, budgetId: string) : string =>  {return `orgs/${orgId}/budgets/${budgetId}/plans`};

let BUDGET_PARENTS: Budget[] = [];
let BUDGET_PARENTS_IDS: string[] = [];

export class BdgtCalculateHeaderPubSub extends FunctionHandler<{orgId: string, parentBudgetId: string, childHeaderResult: BudgetHeaderResult}, boolean>
{

  public async execute(budgetData: {orgId: string, parentBudgetId: string, childHeaderResult: BudgetHeaderResult}, context: FunctionContext, tools: HandlerTools) {

    tools.Logger.log(() => `Starting calculate budget header pubsub for ${budgetData.parentBudgetId}`);

    let budgetsRepo = tools.getRepository<Budget>(BUDGETS_REPO_PATH(budgetData.orgId));

    let budget = await budgetsRepo.getDocumentById(budgetData.parentBudgetId);

    BUDGET_PARENTS = await this.checkIfBudgetHasParent(budget, tools);
    
    if (BUDGET_PARENTS && BUDGET_PARENTS.length > 0) {
      tools.Logger.log(() => `Budget has a parent(s)`);

      BUDGET_PARENTS_IDS = BUDGET_PARENTS.map((budget) => budget.id!);

      if (BUDGET_PARENTS_IDS.includes(budgetData.parentBudgetId))
        throw 'This scenario will cause endless loop';
      
    } else {
      const plans = await this.getBudgetPlans(budget, tools);
      let scopedResult = await this.calculateHeaderResults(budget, budgetData.childHeaderResult, tools);

      await this.saveBudgetHeaders(scopedResult, tools);

      if (BUDGET_PARENTS.length > 0) {

      }
    }

    return true;
  }

  private async checkIfBudgetHasParent(budget: Budget, tools: HandlerTools): Promise< Budget[]> {
    tools.Logger.log(() => `Checking if budget has a parent`);

    let budgetsRepo = tools.getRepository<Budget>(BUDGETS_REPO_PATH(budget.orgId));

    let budgets = await budgetsRepo.getDocuments(new Query());

    let budgetParents = budgets.filter((budget) => budget.childrenList.includes(budget.id!));

    return budgetParents;
  }

  private async getBudgetPlans(budget: Budget, tools: HandlerTools): Promise<TransactionPlan[]> {
    tools.Logger.log(() => `Fetching budget Plans for ${budget.id}`);

    let plansRepo = tools.getRepository<TransactionPlan>(PLANS_REPO_PATH(budget.orgId, budget.id!));

    let plans = await plansRepo.getDocuments(new Query());

    return plans;
  }

  private async calculateHeaderResults(budget: Budget, childResults: BudgetHeaderResult, tools: HandlerTools) {
    tools.Logger.log(() => `Calculating header results`);

    let parentHeadersRepo = tools.getRepository<BudgetHeaderResult>(BUDGETS_HEADERS_REPO_PATH(budget.orgId, budget.id));
    let parentHeaders = await parentHeadersRepo.getDocuments(new Query());

    const parentHeader: BudgetHeaderResult = parentHeaders[0];

    tools.Logger.log(() => `Calculating header results for ${parentHeader.id}`);

    Object.keys(childResults.headers).forEach((year) => {
      let parentYearValues = parentHeader.headers[year];
      let childYearValues = childResults.headers[year];

      tools.Logger.log(() => JSON.stringify(parentYearValues));

      parentYearValues.map((value: number, index: number) => {
        tools.Logger.log(() => `${value} , ${index}`);

        let newValue = value + childYearValues[index];
        parentYearValues[index] = newValue;
      })

      parentHeader.headers[year] = parentYearValues;
    })

    return parentHeader;
  }

  private async saveBudgetHeaders (headerResult: BudgetHeaderResult, tools: HandlerTools): Promise<BudgetHeaderResult>{
    tools.Logger.log(() => `Writing header results`);

    let budgetHeaderRepo = tools.getRepository<BudgetHeaderResult>(BUDGETS_HEADERS_REPO_PATH(headerResult.orgId, headerResult.budgetId));
    return budgetHeaderRepo.update(headerResult);
  }
}