import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';


@NgModule({
  imports: [
    CommonModule
  ],
  providers: []
})
export class BankingStateModule
{
  static forRoot(): ModuleWithProviders<BankingStateModule>
  {
    return {
      ngModule: BankingStateModule,
      providers: []
    };
  }
}