import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialDesignModule, MaterialBricksModule, FlexLayoutModule, MaterialFormBricksModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

// import { AccessControlElementsModule } from '@app/elements/access-control';

import { CompaniesInvoicesComponent } from './components/companies-invoices/companies-invoices.component';

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

    // AccessControlElementsModule,
  ],
  declarations: [
    CompaniesInvoicesComponent
  ],
  exports: [
    CompaniesInvoicesComponent
  ]
})
export class CompaniesInvoicesModule {}