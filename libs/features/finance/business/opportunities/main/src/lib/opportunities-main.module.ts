import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule} from '@angular/cdk/drag-drop';

import { MaterialDesignModule, MaterialBricksModule, FlexLayoutModule, MaterialFormBricksModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { MatSelectFilterModule } from 'mat-select-filter';


import { PageHeadersModule } from '@app/elements/layout/page-headers';
import { iTalPageModule } from '@app/elements/layout/page';;
import { AccessControlModule } from '@app/elements/access-control';

// import { FilterModule } from '@app/features/finance/filter';
import { CreateOpportunityModalStateService } from '@app/features/finance/business/opportunities/create';

import { OpportunitiesFilterComponent } from './components/opportunities-filter/opportunities-filter.component';
import { KanbanViewComponent } from './components/kanban-view/kanban-view.component';
import { OpportunitiesPageComponent } from './pages/opportunities-page/opportunities-page.component';

import { OpportunitiesRouterModule } from './opportunities-main.router';


@NgModule({
  imports: [
    CommonModule,
    MultiLangModule,

    MatSelectFilterModule,

    MaterialDesignModule,
    FlexLayoutModule,
    MaterialFormBricksModule,
    MaterialBricksModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,

    PageHeadersModule,
    iTalPageModule,

    // financeFilterModule,
    AccessControlModule,
    OpportunitiesRouterModule
  ],
  declarations: [
    OpportunitiesPageComponent,
    KanbanViewComponent,
    OpportunitiesFilterComponent
  ],
  exports: [KanbanViewComponent],
  providers: [CreateOpportunityModalStateService]
})
export class financeOpportunitiesMainModule {}
