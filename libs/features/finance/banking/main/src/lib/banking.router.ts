import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { IsLoggedInGuard } from '@app/elements/base/authorisation';


const BANKING_ROUTES: Route[] = [
  // {
  //   path: '',
  //   component: OperationsPageComponent,
  // },
  // {
  //   path: 'banking',
  //   loadChildren: () => import('@app/features/finance/banking/activate-banking').then(m => m.ActivateBankingModule),
  //   canActivate: [IsLoggedInGuard]
  // },
];

@NgModule({
  imports: [RouterModule.forChild(BANKING_ROUTES)],
  exports: [RouterModule]
})
export class BankingRouterModule { }
