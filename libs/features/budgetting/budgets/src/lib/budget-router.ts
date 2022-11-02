import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { FinancialPlanningHomeComponent } from './components/financial-planning-home/financial-planning-home.component';

const BUDGET_EXPL_ROUTES: Route[] = [
  {
    path: '',
    component: FinancialPlanningHomeComponent
  },
  {
    path: ':budgetId',
    loadChildren: () => import('@app/features/budgetting/budget-explorer').then(m => m.BudgetExplorerFeatureModule),
  }
];

@NgModule({
  imports: [RouterModule.forChild(BUDGET_EXPL_ROUTES)],
  exports: [RouterModule]
})
export class BudgetRouter { }
