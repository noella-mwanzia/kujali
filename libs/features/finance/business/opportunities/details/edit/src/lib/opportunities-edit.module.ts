import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatSelectFilterModule } from 'mat-select-filter';

import { MaterialDesignModule, MaterialBricksModule, FlexLayoutModule, MaterialFormBricksModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { iTalPageModule } from '@app/elements/layout/page';
import { PageHeadersModule } from '@app/elements/layout/page-headers';
import { FormFieldsModule } from '@app/elements/forms/form-fields';
// import { AccessControlElementsModule } from '@app/elements/access-control';

import { OpportunitiesEditPageComponent } from './pages/opportunities-edit-page/opportunities-edit-page.component';

import { OpportunitiesEditModelService } from './services/opportunities-edit-model.service';

import { OpportunitiesEditRouterModule } from './opportunities-edit.router';

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

    iTalPageModule,
    PageHeadersModule,
    FormFieldsModule,

    // AccessControlElementsModule,

    OpportunitiesEditRouterModule
  ],
  declarations: [
    OpportunitiesEditPageComponent
  ],
  exports: [OpportunitiesEditPageComponent],
  providers: [OpportunitiesEditModelService]
})
export class OpportunitiesEditModule {}