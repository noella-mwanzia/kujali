import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialDesignModule, MaterialBricksModule, FlexLayoutModule, MaterialFormBricksModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { AccessControlModule } from '@app/elements/access-control';

import { CompaniesContactsModule } from "@app/features/finance/business/companies/details/contacts";
import { CompaniesOpportunitiesModule } from '@app/features/finance/business/companies/details/opportunities';
import { CompaniesInvoicesModule } from '@app/features/finance/business/companies/details/invoices';
import { ActivitiesModule } from '@app/features/activities';

import { CompaniesActivitiesTabsComponent } from './components/company-activities-tabs/company-activities-tabs.component';

@NgModule({
  imports: [
    CommonModule,
    MultiLangModule,
    MaterialDesignModule,
    MaterialBricksModule,
    FlexLayoutModule,
    MaterialFormBricksModule,
    FormsModule,
    ReactiveFormsModule,

    CompaniesContactsModule,
    ActivitiesModule,

    CompaniesOpportunitiesModule,
    CompaniesInvoicesModule,

    AccessControlModule
  ],

  declarations: [
    CompaniesActivitiesTabsComponent,
  ],
  
  exports: [
    CompaniesActivitiesTabsComponent,
  ],
})
export class CompaniesActivitiesModule {}