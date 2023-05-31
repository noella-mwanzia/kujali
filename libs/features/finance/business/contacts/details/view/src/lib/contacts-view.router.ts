import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { SingleContactDetailPage } from './pages/single-contact-detail/single-contact-detail.component';


const CONTACTS_VIEW_ROUTES: Route[] = [

  { path: '', component: SingleContactDetailPage },

  {
    path: 'edit',
    loadChildren: () => import('libs/features/finance/business/contacts/details/edit/src/lib/contacts-edit.module').then(m => m.ContactsEditModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(
      CONTACTS_VIEW_ROUTES,
    )
  ],
  exports: [
    RouterModule
  ]
})
export class ContactsViewRouterModule { }
