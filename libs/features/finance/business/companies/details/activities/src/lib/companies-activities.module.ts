import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialDesignModule, MaterialBricksModule, FlexLayoutModule, MaterialFormBricksModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { CompaniesActivitiesTabsComponent } from './components/company-activities-tabs/company-activities-tabs.component';

import { CompaniesContactsModule } from "@app/features/finance/business/companies/details/contacts";
// import { FeaturesCrmActionsModule } from '@app/features/finance/actions';

import { CompaniesOpportunitiesModule } from '@app/features/finance/business/companies/details/opportunities';
import { CompaniesInvoicesModule } from '@app/features/finance/business/companies/details/invoices';
// import { AccessControlElementsModule } from '@app/elements/access-control';

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
    // FeaturesCrmActionsModule,

    CompaniesOpportunitiesModule,
    CompaniesInvoicesModule,

    // AccessControlElementsModule
  ],

  declarations: [
    CompaniesActivitiesTabsComponent,
  ],
  
  exports: [
    CompaniesActivitiesTabsComponent,
  ],
})
export class CompaniesActivitiesModule {}