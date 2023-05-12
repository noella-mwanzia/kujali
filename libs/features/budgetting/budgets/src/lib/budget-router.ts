import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { SelectBudgetPageComponent } from './pages/select-budget/select-budget.component';

const BUDGET_EXPL_ROUTES: Route[] = [
  {
    path: '',
    component: SelectBudgetPageComponent
  },
  {
    path: ':budgetId/edit',
    loadChildren: () => import('libs/features/budgetting/budget-explorer/src/lib/budget-explorer.module').then(m => m.BudgetExplorerFeatureModule),
  },
  {
    path: ':budgetId/view',
    loadChildren: () => import('libs/features/budgetting/budget-explorer/src/lib/budget-explorer.module').then(m => m.BudgetExplorerFeatureModule),
  }
];

@NgModule({
  imports: [RouterModule.forChild(BUDGET_EXPL_ROUTES)],
  exports: [RouterModule]
})
export class BudgetRouter { }
