import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { MatSelectFilterModule } from 'mat-select-filter';

import {MaterialDesignModule, MaterialBricksModule, FlexLayoutModule, MaterialFormBricksModule} from '@iote/bricks-angular';

import { MultiLangModule } from '@ngfi/multi-lang';
// import { FileStorageService } from "@ngfi/files"

import { iTalPageModule } from '@app/elements/layout/page';
import { PageHeadersModule } from '@app/elements/layout/page-headers';
import { FormFieldsModule } from '@app/elements/forms/form-fields';
import { AccessControlModule } from '@app/elements/access-control';

import { ContactsEditPageComponent } from './pages/contacts-edit-page/contacts-edit-page.component';
import { ChangeProfilePictureComponent } from '../lib/components/change-profile-picture/change-profile-picture.component';

import { ContactsEditRouterModule } from './contacts-edit.router';


@NgModule({
  imports: [
    CommonModule,

    MaterialDesignModule,
    MaterialBricksModule,
    FlexLayoutModule,
    MaterialFormBricksModule,

    MatSelectFilterModule,

    MultiLangModule,
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    ReactiveFormsModule,

    FormFieldsModule,
    iTalPageModule,
    PageHeadersModule,

    AccessControlModule,

    ContactsEditRouterModule
  ],

  declarations: [
    ContactsEditPageComponent, 
    ChangeProfilePictureComponent
  ],
  providers: [
    [AngularFirestore],

  ],
})
export class ContactsEditModule { }