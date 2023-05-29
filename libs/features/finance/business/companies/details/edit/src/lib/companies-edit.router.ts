import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { CompaniesEditPageComponent } from './pages/companies-edit-page/companies-edit-page.component';

const COMPANIES_EDIT_ROUTES: Route[] = [
  { path: '', component: CompaniesEditPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(COMPANIES_EDIT_ROUTES)],
  exports: [RouterModule]
})
export class CompaniesEditRouterModule { }
