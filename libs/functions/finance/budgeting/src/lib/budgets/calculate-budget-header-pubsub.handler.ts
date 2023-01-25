import { HandlerTools } from '@iote/cqrs';
import { Query } from '@ngfi/firestore-qbuilder';
import { FunctionContext, FunctionHandler } from '@ngfi/functions';

import { ___CalculateLocalBudget, ___PlannedTransactionsToBudgetLines,
         ___RenderBudget } from '@app/model/finance/planning/budget-calculation';
import { Budget } from '@app/model/finance/planning/budgets';
import { TransactionPlan } from '@app/model/finance/planning/budget-items';
import { BudgetHeaderResult } from '@app/model/finance/planning/budget-lines';

import { __PubSubPublishAction } from '@app/functions/pubsub';

import { updateParentHeaders } from '../common/update-parent-headers.function';
import { calculateHeaderResults } from '../common/calculate-header-results.function';
import { createBudgetHeaderResult } from '../common/create-budget-header-result.function';

const BUDGETS_REPO_PATH = (orgId: string) : string =>  {return `orgs/${orgId}/budgets`};
const BUDGETS_HEADERS_REPO_PATH = (orgId: string, budgetId: string) : string =>  {return `orgs/${orgId}/budgets/${budgetId}/headers`};
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
    }

    let scopedResult = await this._calculateHeaderResults(budget, budgetData.childHeaderResult, tools);

    await this._updateParentHeaders(scopedResult, budget, tools);

    return true;
  }

  /**
   * Checks if the current budget has a parent(s)
   * @param budget 
   * @param tools 
   * @returns a list of the parent budget(s) or empty if none.
   */
  private async checkIfBudgetHasParent(budget: Budget, tools: HandlerTools): Promise< Budget[]> {
    tools.Logger.log(() => `Checking if budget has a parent`);

    let budgetsRepo = tools.getRepository<Budget>(BUDGETS_REPO_PATH(budget.orgId));

    let budgets = await budgetsRepo.getDocuments(new Query());

    let budgetParents = budgets.filter((budget) => budget.childrenList.includes(budget.id!));

    return budgetParents;
  }

  /**
   * Calculates the new parent header values by adding
   * the result of the child to the parent monthly values
   * @param budget 
   * @param childResults 
   * @param tools 
   * @returns a calculates header result value
   */
  private async _calculateHeaderResults(budget: Budget, childResults: BudgetHeaderResult, tools: HandlerTools): Promise<BudgetHeaderResult> {
    tools.Logger.log(() => `Calculating header results`);

    let plans =  await this._getBudgetPlans(budget, tools);

    let renderedResults = calculateHeaderResults(budget, plans, tools);

    const parentHeader: BudgetHeaderResult = createBudgetHeaderResult(renderedResults, tools);

    tools.Logger.log(() => `Calculating header results for ${parentHeader.id}`);

    Object.keys(childResults.headers).forEach((year) => {
      let parentYearValues = parentHeader.headers[year];
      let childYearValues = childResults.headers[year];

      parentYearValues.map((value: number, index: number) => {
        let newValue = value + childYearValues[index];
        parentYearValues[index] = newValue;
      })

      parentHeader.headers[year] = parentYearValues;
    })

    return parentHeader;
  }

  private async _getBudgetPlans(budget: Budget, tools: HandlerTools): Promise<TransactionPlan[]> {
    tools.Logger.log(() => `Fetching budget Plans for ${budget.id}`);

    let plansRepo = tools.getRepository<TransactionPlan>(PLANS_REPO_PATH(budget.orgId, budget.id!));

    let plans = await plansRepo.getDocuments(new Query());

    return plans;
  }

  /**
   * Update current header and Loops through and updates all 
   * the parent budgets headers 
   * @param header
   * @param tools
   */
  private async _updateParentHeaders(header: BudgetHeaderResult, budget: Budget, tools: HandlerTools) {

    let headersRepo = tools.getRepository<BudgetHeaderResult>(BUDGETS_HEADERS_REPO_PATH(header.orgId, header.budgetId));
    await headersRepo.create(header, header.id);

    await updateParentHeaders(BUDGET_PARENTS_IDS, header, budget, tools);
  }
}