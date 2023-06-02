import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialDesignModule, MaterialBricksModule, FlexLayoutModule, MaterialFormBricksModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { iTalPageModule } from '@app/elements/layout/page';
import { PageHeadersModule } from '@app/elements/layout/page-headers';

import { NotesModule } from '@app/features/notes';
import { OpportunitiesActivitiesModule } from '@app/features/finance/business/opportunities/details/activities';

import { OpportunityDetailsComponent } from './components/opportunity-details/opportunity-details.component';
import { OpportunityInformationCardComponent } from './components/opportunity-information-card/opportunity-information-card.component';

import { SingleOpportunityDetailComponent } from './pages/single-opportunity-detail/single-opportunity-detail.component';

import { OpportunitiesViewRouterModule } from './opportunities-view.router';

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

    iTalPageModule,
    PageHeadersModule,
    NotesModule,
    OpportunitiesActivitiesModule,
    OpportunitiesViewRouterModule
  ],
  declarations: [
    SingleOpportunityDetailComponent,
    OpportunityDetailsComponent,
    OpportunityInformationCardComponent
  ],
  exports: [
    OpportunityDetailsComponent
  ]
})
export class OpportunitiesViewModule {}