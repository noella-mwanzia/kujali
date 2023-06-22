import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialDesignModule, MaterialBricksModule, FlexLayoutModule, MaterialFormBricksModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { AccessControlModule } from '@app/elements/access-control';

import { CompaniesContactsComponent } from './components/companies-contacts/companies-contacts.component';


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

    AccessControlModule
  ],

  declarations: [
    CompaniesContactsComponent
  ],
  exports : [
    CompaniesContactsComponent
  ]
})
export class CompaniesContactsModule {}