import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BudgetsStateModule } from '@app/state/finance/budgetting/budgets';

@NgModule({
  imports: [CommonModule,
  
    BudgetsStateModule],
})
export class FeaturesBudgettingBudgetExplorerModule {}
