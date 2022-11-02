import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MultiLangModule } from '@ngfi/multi-lang';
import { FlexLayoutModule, MaterialBricksModule, MaterialDesignModule } from '@iote/bricks-angular';

import { UserStateModule } from '@app/state/user';
import { BudgetsStateModule } from '@app/state/finance/budgetting/budgets';
import { BudgetRenderingStateModule } from '@app/state/finance/budgetting/rendering';

import { iTalPageModule } from '@app/elements/layout/page';

import { BudgetExplorerRouter } from './budget-explorer-router';

import { YearFocusComponent } from './components/year-focus/year-focus.component';

import { FinancialPlanPlTablesComponent } from './components/financial-plan-pl-tables/financial-plan-pl-tables.component';
import { FinancialPlanTableComponent }    from './components/financial-plan-table/financial-plan-table.component';

import { FinancialPlanExplorerPageComponent } from './pages/financial-plan-explorer/financial-plan-explorer.component';

@NgModule({
  imports: [
    CommonModule, RouterModule, MultiLangModule,
    MaterialDesignModule, MaterialBricksModule, FlexLayoutModule,
    FormsModule, ReactiveFormsModule,
    UserStateModule,

    iTalPageModule,

    BudgetExplorerRouter,
    BudgetsStateModule, BudgetRenderingStateModule],

  providers: [
    FinancialPlanExplorerPageComponent,
  ],

  declarations: [
    FinancialPlanExplorerPageComponent, 
             
    YearFocusComponent,
    FinancialPlanPlTablesComponent,
    FinancialPlanTableComponent 
    // FinancialPlanBurnChartComponent,  
    
    // FinancialPlanPlTablesComponent, FinancialPlanResultTableComponent,
    // , FinancialPlanTableComponent, PlTableContextMenuComponent,
     
    // LinkBudgetModalComponent]
  ]
})
export class BudgetExplorerFeatureModule {}
