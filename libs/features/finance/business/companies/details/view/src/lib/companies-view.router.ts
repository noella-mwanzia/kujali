import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { SingleCompanyDetailComponent } from './pages/single-company-detail/single-company-detail.component';

const COMPANIES_VIEW_ROUTES: Route[] = [

  { path: '', component: SingleCompanyDetailComponent },

  {
    path: 'edit',
    loadChildren: () => import('libs/features/finance/business/companies/details/edit/src/lib/companies-edit.module').then(m => m.CompaniesEditModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(COMPANIES_VIEW_ROUTES)
  ],
  exports: [
    RouterModule
  ]
})
export class CompaniesViewRouterModule { }
