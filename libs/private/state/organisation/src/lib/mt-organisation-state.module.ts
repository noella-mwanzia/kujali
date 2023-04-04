// 
// This file is licensed under the "Elewa Commercial License v1"
// All rights reserved.
//
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ActiveOrgStore } from '@app/state/organisation';
import { MtActiveOrgStore } from './stores/mt-active-org.store';

@NgModule({
  imports: [CommonModule,
             RouterModule],
  providers: []
})
export class MtOrgStateModule
{
  static forRoot(): ModuleWithProviders<MtOrgStateModule>
  {
    return {
      ngModule: MtOrgStateModule,
      providers: [
       { provide: ActiveOrgStore, useClass: MtActiveOrgStore }
      ]
    };
  }
}
