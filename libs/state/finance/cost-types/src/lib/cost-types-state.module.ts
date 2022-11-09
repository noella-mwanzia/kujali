import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CostTypesStore } from './stores/cost-types.store';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class CostTypesStateModule 
{ 
  static forRoot(): ModuleWithProviders<CostTypesStateModule>
  {
    return {
      ngModule: CostTypesStateModule,
      providers: [
        CostTypesStore
      ]
    };
  }
}
