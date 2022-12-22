import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OperationsRouterModule } from './operations-base.router';

@NgModule({
  imports: [
    CommonModule,

    OperationsRouterModule
  ],
})
export class OperationsBaseModule {}
