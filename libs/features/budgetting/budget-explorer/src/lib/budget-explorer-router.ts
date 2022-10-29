import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { FinancialPlanExplorerPageComponent } from './pages/financial-plan-explorer/financial-plan-explorer.component';

const BUDGET_EXPL_ROUTES: Route[] = [
  {
    path: '',
    component: FinancialPlanExplorerPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(BUDGET_EXPL_ROUTES)],
  exports: [RouterModule]
})
export class BudgetExplorerRouter { }
