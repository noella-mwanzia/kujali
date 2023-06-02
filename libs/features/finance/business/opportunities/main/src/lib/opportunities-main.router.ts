import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { OpportunitiesPageComponent } from './pages/opportunities-page/opportunities-page.component';


const OPPORTUNITIES_ROUTES: Route[] = [
  { path: '', component: OpportunitiesPageComponent },
  {
    path: ':id',
    loadChildren: () => import('libs/features/finance/business/opportunities/details/view/src/lib/opportunities-view.module').then(m => m.OpportunitiesViewModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(OPPORTUNITIES_ROUTES)],
  exports: [RouterModule]
})
export class OpportunitiesRouterModule { }
