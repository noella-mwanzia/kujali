import { HandlerTools } from '@iote/cqrs';
import { Query } from '@ngfi/firestore-qbuilder';
import { FunctionContext, FunctionHandler } from '@ngfi/functions';

import { Budget } from '@app/model/finance/planning/budgets';
import { TransactionPlan } from '@app/model/finance/planning/budget-items';
import { RenderedBudget } from '@app/model/finance/planning/budget-rendering';
import { BudgetHeaderResult } from '@app/model/finance/planning/budget-lines';
import { ___CalculateLocalBudget, ___PlannedTransactionsToBudgetLines, 
         ___RenderBudget } from '@app/model/finance/planning/budget-calculation';

import { __PubSubPublishAction } from '@app/functions/pubsub';

import { updateParentHeaders } from '../common/update-parent-headers.function';
import { calculateHeaderResults } from '../common/calculate-header-results.function';
import { createBudgetHeaderResult } from '../common/create-budget-header-result.function';


const BUDGETS_REPO_PATH = (orgId: string) : string =>  {return `orgs/${orgId}/budgets`};
const BUDGETS_HEADERS_REPO_PATH = (orgId: string, budgetId: string) : string =>  {return `orgs/${orgId}/budgets/${budgetId}/headers`};

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
    }

    let scopedResult = calculateHeaderResults(budgetData.budget, budgetData.plans, tools)
    await this.saveBudgetHeaders(scopedResult, budgetData.budget, tools);

    return false;
  }

  /**
   * Checks if the the active budget has a parent(s)
   * @param budget 
   * @param tools 
   * @returns the parent budget(s) list
   */
  private async checkIfBudgetHasParent(budget: Budget, tools: HandlerTools): Promise< Budget[]> {
    tools.Logger.log(() => `Checking if budget has a parent(s)`);

    let budgetsRepo = tools.getRepository<Budget>(BUDGETS_REPO_PATH(budget.orgId));

    let budgets = await budgetsRepo.getDocuments(new Query().where('childrenList', 'array-contains', budget.id));

    return budgets;
  }

  /**
   * Creates the budget result header object and saves to firebase
   * @param budget 
   * @param tools 
   * @returns 
   */
  private async saveBudgetHeaders (budget: RenderedBudget, budgetData: Budget, tools: HandlerTools) {
    tools.Logger.log(() => `saving header results`);

    let header: BudgetHeaderResult  = createBudgetHeaderResult(budget, tools);

    let budgetHeaderRepo = tools.getRepository<BudgetHeaderResult>(BUDGETS_HEADERS_REPO_PATH(header.orgId, header.budgetId));

    await budgetHeaderRepo.create(header, header.id);

    await updateParentHeaders(BUDGET_PARENTS_IDS, header, budgetData, tools);
  }
}