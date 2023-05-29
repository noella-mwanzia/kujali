import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { MaterialDesignModule, MaterialBricksModule, FlexLayoutModule, MaterialFormBricksModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { NotesComponent } from './components/notes/notes.component';

@NgModule({
  imports: [
    CommonModule,
    MultiLangModule,

    CKEditorModule,
    
    MaterialDesignModule,
    FlexLayoutModule,
    MaterialFormBricksModule,
    MaterialBricksModule,
    FormsModule,
    ReactiveFormsModule

  ],
  declarations: [
    NotesComponent
  ],

  exports: [
    NotesComponent
  ]
})
export class NotesModule {}
