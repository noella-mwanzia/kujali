import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// import { Ng2TelInputModule } from 'ng2-tel-input';
import { MatSelectFilterModule } from 'mat-select-filter';

import { MaterialDesignModule, MaterialBricksModule, FlexLayoutModule, MaterialFormBricksModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { AddNewOpportunityComponent } from './components/add-new-opportunity/add-new-opportunity.component';

import { FormFieldsModule } from '@app/elements/forms/form-fields';
// import { AccessControlElementsModule } from '@kujali/elements/access-control';

import { BusinessContactsCreateModule } from '@app/features/finance/business/contacts/create';
import { NewContactComponent } from './components/new-contact/new-contact.component';
import { NewCompanyComponent } from './components/new-company/new-company.component';

@NgModule({
  imports: [
    CommonModule,
    MultiLangModule,

    MaterialDesignModule,
    FlexLayoutModule,
    MaterialFormBricksModule,
    MaterialBricksModule,

    MatSelectFilterModule,

    FormsModule,
    ReactiveFormsModule,

    FormFieldsModule,
    BusinessContactsCreateModule,
    // AccessControlElementsModule
],
  declarations: [
    AddNewOpportunityComponent,
    NewContactComponent,
    NewCompanyComponent
  ],

  exports: [
    AddNewOpportunityComponent
  ]
})
export class financeOpportunitiesCreateModule {}
