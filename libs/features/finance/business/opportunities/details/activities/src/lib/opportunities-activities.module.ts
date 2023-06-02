import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialDesignModule, MaterialBricksModule, FlexLayoutModule, MaterialFormBricksModule } from '@iote/bricks-angular';

import { MultiLangModule } from '@ngfi/multi-lang';

import { ActivitiesModule } from '@app/features/activities';

import { ActivitiesTabsComponent } from './components/activities-tabs/activities-tabs.component';

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

    ActivitiesModule
  ],
  declarations: [
    ActivitiesTabsComponent
  ],
  exports: [
    ActivitiesTabsComponent
  ]
})
export class OpportunitiesActivitiesModule {}