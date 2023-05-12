import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataProvider }  from './data/data.provider';


/**
 * kujali Providers Module. Collection of service links to the backend.
 */
@NgModule({
  imports: [CommonModule],
  providers: [],
})
export class KujaliProvidersModule
{
  static forRoot(): ModuleWithProviders<KujaliProvidersModule>
  {
    return {
      ngModule: KujaliProvidersModule,
      providers: [
        DataProvider
      ]
    };
  }
}