import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { IsLoggedInGuard } from '@app/elements/base/authorisation';

import { ConnectPontoComponent } from './components/connect-ponto/connect-ponto.component';

import { BankingPageComponent } from './pages/banking-page/banking-page.component';

const OPERATIONS_ROUTES: Route[] = [
  {
    path: '',
    component: BankingPageComponent,
    
  },
  {
    path: 'connect-ponto',
    component: ConnectPontoComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(OPERATIONS_ROUTES)],
  exports: [RouterModule]
})
export class OperationsRouterModule { }
