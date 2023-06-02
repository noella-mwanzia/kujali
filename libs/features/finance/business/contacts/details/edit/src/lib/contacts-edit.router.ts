import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { ContactsEditPageComponent } from './pages/contacts-edit-page/contacts-edit-page.component';

const CONTACTS_EDIT_ROUTES: Route[] = [
  { path: '', component: ContactsEditPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(CONTACTS_EDIT_ROUTES)],
  exports: [RouterModule]
})
export class ContactsEditRouterModule { }
