import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialDesignModule, MaterialBricksModule, FlexLayoutModule, MaterialFormBricksModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';


import { iTalPageModule } from '@app/elements/layout/page';
import { PageHeadersModule } from '@app/elements/layout/page-headers';

import { NotesModule } from '@app/features/notes';
import { CompaniesActivitiesModule } from '@app/features/finance/business/companies/details/activities';
import { CompaniesOpportunitiesModule } from '@app/features/finance/business/companies/details/opportunities'

import { CreateOpportunityModalStateService } from '@app/features/finance/business/opportunities/create';

// import { AccessControlElementsModule } from '@app/elements/access-control';

import { CompanyDetailsComponent } from './components/company-details/company-details.component';
import { CompanyInformationComponent } from './components/company-information/company-information.component';

import { SingleCompanyDetailComponent } from './pages/single-company-detail/single-company-detail.component';

import { CompaniesViewRouterModule } from './companies-view.router';

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

    iTalPageModule,
    PageHeadersModule,
    NotesModule,
    CompaniesActivitiesModule,    
    CompaniesOpportunitiesModule,

    // AccessControlElementsModule,

    CompaniesViewRouterModule
  ],

  declarations: [
    SingleCompanyDetailComponent,
    CompanyDetailsComponent,
    CompanyInformationComponent,
  ],
  providers: [CreateOpportunityModalStateService]
})
export class CompaniesViewModule {}