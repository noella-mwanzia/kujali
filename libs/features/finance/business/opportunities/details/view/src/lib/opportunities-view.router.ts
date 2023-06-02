import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { SingleOpportunityDetailComponent } from './pages/single-opportunity-detail/single-opportunity-detail.component';


const OPPS_VIEW_ROUTES: Route[] = [

  { path: '', component: SingleOpportunityDetailComponent },

  {
    path: 'edit',
    loadChildren: () => import('libs/features/finance/business/opportunities/details/edit/src/lib/opportunities-edit.module').then(m => m.OpportunitiesEditModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(
      OPPS_VIEW_ROUTES    )
  ],
  exports: [
    RouterModule
  ]
})
export class OpportunitiesViewRouterModule { }
