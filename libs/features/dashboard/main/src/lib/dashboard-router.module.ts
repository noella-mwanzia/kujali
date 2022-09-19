import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { DashboardPageComponent } from './pages/dashboard/dashboard.page';

const DASHBOARD_ROUTES: Route[] = [
  {
    path: '',
    component: DashboardPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(DASHBOARD_ROUTES)],
  exports: [RouterModule]
})
export class DashboardRouterModule { }
