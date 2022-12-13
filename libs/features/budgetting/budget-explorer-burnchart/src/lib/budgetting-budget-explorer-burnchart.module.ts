import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MultiLangModule } from '@ngfi/multi-lang';
import { FlexLayoutModule, MaterialBricksModule, MaterialDesignModule } from '@iote/bricks-angular';

import { NgxSliderModule } from '@angular-slider/ngx-slider';

import { UserStateModule } from '@app/state/user';
import { BudgetsStateModule } from '@app/state/finance/budgetting/budgets';
import { BudgetRenderingStateModule } from '@app/state/finance/budgetting/rendering';

import { iTalPageModule } from '@app/elements/layout/page';

import { FinancialPlanBurnChartComponent } from './components/financial-plan-burn-chart/financial-plan-burn-chart.component';
import { BurnChartComponent } from './components/burn-chart/burn-chart.component';

@NgModule({
  imports: [
    CommonModule, RouterModule, MultiLangModule,
    MaterialDesignModule, MaterialBricksModule, FlexLayoutModule,
    FormsModule, ReactiveFormsModule,
    UserStateModule,

    NgxSliderModule,

    iTalPageModule,

    BudgetsStateModule, BudgetRenderingStateModule],

  declarations: [
    FinancialPlanBurnChartComponent,
    BurnChartComponent
  ],
  exports: [
    FinancialPlanBurnChartComponent
  ]
})
export class BudgetExplorerBurnchartModule {}
