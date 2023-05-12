import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { OpportunitiesPageComponent } from './pages/opportunities-page/opportunities-page.component';


const OPPORTUNITIES_ROUTES: Route[] = [
  { path: '', component: OpportunitiesPageComponent },
  // {
  //   path: ':id',
  //   loadChildren: () => import('libs/features/finance/opportunities/details/view/src/lib/finance-opportunities-details-view.module').then(m => m.financeOpportunitiesDetailsViewModule),
  // },
];

@NgModule({
  imports: [RouterModule.forChild(OPPORTUNITIES_ROUTES)],
  exports: [RouterModule]
})
export class OpportunitiesRouterModule { }
