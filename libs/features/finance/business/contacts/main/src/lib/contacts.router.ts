import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { ContactsPageComponent } from './pages/contacts-page.component';


const CONTACTS_ROUTES: Route[] = [
  { path: '', component: ContactsPageComponent },
  // {
  //   path: ':id',
  //   loadChildren: () => import('libs/features/finance/contacts/details/view/src/lib/features-finance-contacts-details-view.module').then(m => m.FeaturesfinanceContactsDetailsViewModule),
  // },
];

@NgModule({
  imports: [RouterModule.forChild(CONTACTS_ROUTES)],
  exports: [RouterModule]
})
export class ContactsRouterModule { }
