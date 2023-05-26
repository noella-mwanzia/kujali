import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { MatSelectFilterModule } from 'mat-select-filter';
// import { Ng2TelInputModule } from 'ng2-tel-input';

import {
  MaterialDesignModule,
  MaterialBricksModule,
  FlexLayoutModule,
  MaterialFormBricksModule,
} from '@iote/bricks-angular';

import { MultiLangModule } from '@ngfi/multi-lang';

// import { FileStorageService } from "@ngfi/files"

import { iTalPageModule } from '@app/elements/layout/page';
import { PageHeadersModule } from '@app/elements/layout/page-headers';
import { FormFieldsModule } from '@app/elements/forms/form-fields';

// import { AccessControlElementsModule } from '@app/elements/access-control';

import { ChangeProfilePictureComponent } from './components/change-profile-picture/change-profile-picture.component';
import { CompaniesEditPageComponent } from './pages/companies-edit-page/companies-edit-page.component';

import { CompaniesEditRouterModule } from './companies-edit.router';

@NgModule({
  imports: [
    CommonModule,

    MaterialDesignModule,
    MaterialBricksModule,
    FlexLayoutModule,
    MaterialFormBricksModule,
    MatDialogModule,
    MatSelectFilterModule,

    MultiLangModule,
    // Ng2TelInputModule,

    iTalPageModule,
    PageHeadersModule,
    FormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    FormFieldsModule,

    // AccessControlElementsModule,

    CompaniesEditRouterModule
  ],
  providers: [AngularFirestore],

  declarations: [
    CompaniesEditPageComponent,
    ChangeProfilePictureComponent,
  ],
})
export class CompaniesEditModule {}