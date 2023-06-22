import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialDesignModule, MaterialBricksModule, FlexLayoutModule, MaterialFormBricksModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { AccessControlModule } from '@app/elements/access-control';

import { ContactOpportunitiesComponent } from './components/contact-opportunities/contact-opportunities.component';

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
    ContactOpportunitiesComponent
  ],
  exports: [ContactOpportunitiesComponent]
})
export class ContactsOpportunitiesModule {}
