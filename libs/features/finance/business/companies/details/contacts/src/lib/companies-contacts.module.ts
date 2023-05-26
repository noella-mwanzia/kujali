import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialDesignModule, MaterialBricksModule, FlexLayoutModule, MaterialFormBricksModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { CompaniesContactsComponent } from './components/companies-contacts/companies-contacts.component';

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

    // AccessControlElementsModule
  ],

  declarations: [
    CompaniesContactsComponent
  ],
  exports : [
    CompaniesContactsComponent
  ]
})
export class CompaniesContactsModule {}