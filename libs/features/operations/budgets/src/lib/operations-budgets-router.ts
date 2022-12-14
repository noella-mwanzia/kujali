import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { OperationsBudgetsPageComponent } from './pages/operations-budgets/operations-budgets.page';

const OPERATIONS_ROUTES: Route[] = [
  {
    path: '',
    component: OperationsBudgetsPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(OPERATIONS_ROUTES)],
  exports: [RouterModule]
})
export class OperationBudgetsRouterModule { }
