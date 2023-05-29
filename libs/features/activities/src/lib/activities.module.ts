import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MatSelectFilterModule } from 'mat-select-filter';


import {
  FlexLayoutModule,
  MaterialBricksModule,
  MaterialDesignModule,
  MaterialFormBricksModule,
} from '@iote/bricks-angular';

import { MultiLangModule } from '@ngfi/multi-lang';

// import { AccessControlStateModule } from '@app/state/access-control';

import { ActivitiesComponent } from './components/activities/activities.component';
import { AddNewActivityComponent } from './components/add-new-activity/add-new-activity.component';

import { ActionsPermissionsService } from './services/actions-permissions.service';
import { AddNewActionModelService } from './services/add-new-action-model.service';
import { MatDatepickerModule } from '@angular/material/datepicker';

@NgModule({
  imports: [
    CommonModule,

    MultiLangModule,
    MaterialDesignModule,
    MaterialBricksModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    FlexLayoutModule,
    MaterialFormBricksModule,
    MatButtonModule,

    MatSelectFilterModule,

    FormsModule,
    ReactiveFormsModule,

    MatDatepickerModule,

    // AccessControlStateModule,
  ],
  declarations: [ActivitiesComponent, AddNewActivityComponent],

  exports: [ActivitiesComponent, AddNewActivityComponent],
  providers: [ActionsPermissionsService, AddNewActionModelService],
})
export class ActivitiesModule {}