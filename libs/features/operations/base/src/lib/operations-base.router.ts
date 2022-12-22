import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { IsLoggedInGuard } from '@app/elements/base/authorisation';

const OPERATIONS_ROUTES: Route[] = [
  {
    path: '', redirectTo: 'budgets', pathMatch:'full'},
  {
    path: 'budgets',
    loadChildren: () => import('@app/features/operations/budgets').then(m => m.OperationsBudgetsModule),
    canActivate: [IsLoggedInGuard]
  },
  {
    path: 'expenses',
    loadChildren: () => import('@app/features/operations/expenses').then(m => m.OperationsExpensesModule),
    canActivate: [IsLoggedInGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(OPERATIONS_ROUTES)],
  exports: [RouterModule]
})

export class OperationsRouterModule { }
