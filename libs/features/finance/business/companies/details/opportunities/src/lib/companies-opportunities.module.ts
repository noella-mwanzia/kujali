import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialDesignModule, MaterialBricksModule, FlexLayoutModule, MaterialFormBricksModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

// import { AccessControlElementsModule } from '@app/elements/access-control';

import { CompaniesOpportunitiesComponent } from './components/companies-opportunities/companies-opportunities.component';

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

    // AccessControlElementsModule
  ],
  declarations: [
    CompaniesOpportunitiesComponent
  ],
  exports: [CompaniesOpportunitiesComponent]
})
export class CompaniesOpportunitiesModule {}