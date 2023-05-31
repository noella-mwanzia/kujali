import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialDesignModule, MaterialBricksModule, FlexLayoutModule, MaterialFormBricksModule } from '@iote/bricks-angular';

import { MultiLangModule } from '@ngfi/multi-lang';

import { ActivitiesModule } from '@app/features/activities'
import { ContactsOpportunitiesModule } from '@app/features/finance/business/contacts/details/opportunities';
import { ContactsInvoicesModule } from '@app/features/finance/business/contacts/details/invoices';

import { ContactActivitiesTabsComponent } from './components/activities-tabs/activities-tabs.component';

@NgModule({
  imports: [
    CommonModule,
    MultiLangModule,

    MaterialDesignModule,
    FlexLayoutModule,
    MaterialFormBricksModule,
    MaterialBricksModule,
    
    FormsModule,
    ReactiveFormsModule,

    ActivitiesModule,
    ContactsOpportunitiesModule,
    ContactsInvoicesModule
  ],
  declarations: [
    ContactActivitiesTabsComponent,
  ],
  exports: [
    ContactActivitiesTabsComponent,
  ]
})
export class ContactsActivitiesModule {}