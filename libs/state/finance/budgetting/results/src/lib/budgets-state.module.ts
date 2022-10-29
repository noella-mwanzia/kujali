import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BudgetResultQuery } from './queries/budget-result.query';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  providers: [
    BudgetResultQuery
  ]
})
export class BudgetsStateModule { }
