import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { OperationsPageComponent } from './pages/operations-page/operations-page.component';

const OPERATIONS_ROUTES: Route[] = [
  {
    path: '',
    component: OperationsPageComponent,
    
  },
  {
    path: 'ponto-complete',
    component: OperationsPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(OPERATIONS_ROUTES)],
  exports: [RouterModule]
})
export class OperationsRouterModule { }
