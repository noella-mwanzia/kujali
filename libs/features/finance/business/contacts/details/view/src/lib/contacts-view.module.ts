import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialDesignModule, MaterialBricksModule, FlexLayoutModule, MaterialFormBricksModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';


import { ContactDetailsComponent } from './components/contact-details/contact-details.component';
import { ContactInformationCardComponent } from './components/contact-information-card/contact-information-card.component';

import { SingleContactDetailPage } from './pages/single-contact-detail/single-contact-detail.component';

import { iTalPageModule } from '@app/elements/layout/page';
import { PageHeadersModule } from '@app/elements/layout/page-headers';
import { ContactsActivitiesModule } from '@app/features/finance/business/contacts/details/activities'
import { NotesModule } from '@app/features/notes'

import { CreateOpportunityModalStateService } from '@app/features/finance/business/opportunities/create';

import { ContactsViewRouterModule } from './contacts-view.router';

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

    PageHeadersModule,
    iTalPageModule,
    ContactsActivitiesModule,
    NotesModule,

    ContactsViewRouterModule
  ],
  declarations: [
    ContactDetailsComponent,
    ContactInformationCardComponent,
    
    SingleContactDetailPage,
  ],
  exports: [SingleContactDetailPage],
  providers: [CreateOpportunityModalStateService]
})

export class ContactsViewModule {}