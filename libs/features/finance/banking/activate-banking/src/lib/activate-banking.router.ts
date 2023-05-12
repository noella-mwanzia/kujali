import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { IsLoggedInGuard } from '@app/elements/base/authorisation';

import { ConnectPontoComponent } from './components/connect-ponto/connect-ponto.component';


const BANKING_ROUTES: Route[] = [
  {
    path: '',
    component: ConnectPontoComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(BANKING_ROUTES)],
  exports: [RouterModule]
})
export class ActivateBankingRouterModule { }
