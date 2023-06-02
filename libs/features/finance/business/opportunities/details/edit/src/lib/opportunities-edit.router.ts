import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { OpportunitiesEditPageComponent } from './pages/opportunities-edit-page/opportunities-edit-page.component';

const OPPORTUNITIES_EDIT_ROUTES: Route[] = [
  { path: '', component: OpportunitiesEditPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(OPPORTUNITIES_EDIT_ROUTES)],
  exports: [RouterModule]
})

export class OpportunitiesEditRouterModule { }
