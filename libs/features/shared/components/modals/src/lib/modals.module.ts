import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialDesignModule, MaterialBricksModule, FlexLayoutModule } from '@iote/bricks-angular';

import { MultiLangModule } from '@ngfi/multi-lang';

import { SingleActionMessageModalComponent } from './modals/single-action-message-modal/single-action-message-modal.component';

@NgModule({
  imports: [
    CommonModule,

    RouterModule, 
    MultiLangModule,
    MaterialDesignModule, MaterialBricksModule, FlexLayoutModule,
    FormsModule, ReactiveFormsModule,
    
  ],
  declarations: [SingleActionMessageModalComponent],
})
export class ModalsModule {}
