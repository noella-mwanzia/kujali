import { HandlerTools } from '@iote/cqrs';
import { FunctionContext, FunctionHandler } from '@ngfi/functions';

import { TransactionPlan } from '@app/model/finance/planning/budget-items';
import { BudgetRowYear } from '@app/model/finance/planning/budget-lines-by-year';
import { FinancialExplorerState } from '@app/model/finance/planning/budget-rendering-state';

export class PromoteBudgetHandler extends FunctionHandler<any, any>
{

  public async execute(budgetData: {budget: FinancialExplorerState, plans: TransactionPlan[]}, context: FunctionContext, tools: HandlerTools) {

    tools.Logger.log(() => `Starting promote budget`);

    let budget = budgetData.budget.budget;
    let plans = budgetData.plans;
    let allYears: number[] = budgetData.budget.years;

    let allCosts = this.applyfilter(budgetData.budget.scopedCosts);
    let allIncome = this.applyfilter(budgetData.budget.scopedIncome);

    let allPlans = allCosts.concat(allIncome);

    let linesRepo = tools.getRepository<any>(`orgs/${budget.orgId}/expenses/config/lines`);

    tools.Logger.log(() => `Starting to write lines`);


    tools.Logger.log(() => `all plans ${allPlans.length}`);

    allPlans.map((pl) => {

      let fr = plans.find((plan) => plan.lineName.trim().toLowerCase() == pl.name.trim().toLowerCase())?.frequency;

      let line = {
        amountsMonth: pl.amountsMonth,
        amountsYear: pl.amountsYear,
        years: allYears,
        totalYear: pl.totalYear,
        name: pl.name,
        type: pl.type,
        budgetName: budget.name,
        frequency: fr
      }

       linesRepo.write(line, pl.name.toLowerCase()).then( () => {

        tools.Logger.log(() => `creating plan ${pl.name}`);


        let yearRepo = tools.getRepository<any>(`orgs/${budget.orgId}/expenses/config/lines/${pl.name.toLowerCase()}/years`);

        allYears.map((yr) => {
          let year = pl.amountsYear.find((ay) => ay.year == yr)

          yearRepo.write({id: year?.year, total: year?.total}, yr.toString()).then(() => {

            tools.Logger.log(() => `creating plan years`);

            let monthsRepo = tools.getRepository<any>(`orgs/${budget.orgId}/expenses/config/lines/${pl.name.toLowerCase()}/years/${yr.toString()}/months`);

            let months = year?.amountsMonth;

            months?.map((month, index) => {
              tools.Logger.log(() => `creating plan months`);
              // delete month['plan'];
              // month['plan'] = month['plan'].lineName;
              monthsRepo.write(month, index.toString());
            })

          })
        })
      });
    })

  }

  applyfilter(data: BudgetRowYear[]): BudgetRowYear[] {
    return data.filter((row) => 
            row.isHeader === false && (row.name !== 'BUDGETTING.LINES.COST' && row.name !== 'BUDGETTING.LINES.INCOME'))
  }
}