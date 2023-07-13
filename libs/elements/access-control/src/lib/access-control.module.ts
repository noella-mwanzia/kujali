import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HasWriteAccessDirective } from './directives/has-write-access.directive';
import { HasReadAccessDirective } from './directives/has-read-access.directive';
import { HasViewAccessDirective } from './directives/has-view-access.directive';
import { HasDeleteAccessDirective } from './directives/has-delete-access.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [
    HasWriteAccessDirective,
    HasReadAccessDirective,
    HasViewAccessDirective,
    HasDeleteAccessDirective
  ],
  exports: [
    HasWriteAccessDirective,
    HasReadAccessDirective,
    HasViewAccessDirective,
    HasDeleteAccessDirective
  ]
})
export class AccessControlModule {}
