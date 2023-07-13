import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialDesignModule, MaterialBricksModule, FlexLayoutModule, MaterialFormBricksModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { MatSelectFilterModule } from 'mat-select-filter';

import { AccessControlModule } from '@app/elements/access-control';

import { ConfigSettingsComponent } from './pages/config-settings/config-settings.component';

import { ConfigModelService } from './services/config-model.service';
import { ConfigInvoicesService } from './services/config-invoices.service';

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

    AccessControlModule
  ],
  declarations: [
    ConfigSettingsComponent
  ],
  exports: [
    ConfigSettingsComponent
  ],
  providers: [
    ConfigModelService,
    ConfigInvoicesService
  ]
})
export class SettingsConfigModule {}
