import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { IsLoggedInGuard } from '@app/elements/base/authorisation';

import { SingleAccountPageComponent } from './components/single-account-page/single-account-page.component';

import { BankingPageComponent } from './pages/banking-page/banking-page.component';

const BANKING_ROUTES: Route[] = [
  {
    path: '',
    component: BankingPageComponent,
  },
  {
    path: 'accounts/:id',
    component: SingleAccountPageComponent,
  },
  {
    path: 'connect-ponto',
    loadChildren: () => import('@app/features/finance/banking/activate-banking').then(m => m.ActivateBankingModule),
    canActivate: [IsLoggedInGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(BANKING_ROUTES)],
  exports: [RouterModule]
})
export class BankingRouterModule { }
