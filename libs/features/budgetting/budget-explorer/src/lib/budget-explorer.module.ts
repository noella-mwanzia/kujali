import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MultiLangModule } from '@ngfi/multi-lang';
import {
  FlexLayoutModule,
  MaterialBricksModule,
  MaterialDesignModule,
} from '@iote/bricks-angular';

import { UserStateModule } from '@app/state/user';
import { BudgetsStateModule } from '@app/state/finance/budgetting/budgets';
import { BudgetRenderingStateModule } from '@app/state/finance/budgetting/rendering';

import { iTalPageModule } from '@app/elements/layout/page';

import { BudgetPlanningFeatureModule } from '@app/features/budgetting/budget-planning';
import { BudgetExplorerBurnchartModule } from '@app/features/budgetting/budget-explorer-burnchart';

import { BudgetExplorerRouter } from './budget-explorer-router';

import { YearFocusComponent } from './components/year-focus/year-focus.component';

import { FinancialPlanPlTablesComponent } from './components/financial-plan-pl-tables/financial-plan-pl-tables.component';
import { FinancialPlanTableComponent } from './components/financial-plan-table/financial-plan-table.component';
import { FinancialPlanResultTableComponent } from './components/financial-plan-result-table/financial-plan-result-table.component';
import { LinkBudgetModalComponent } from './components/link-budget-modal/link-budget-modal.component';

import { FinancialPlanExplorerPageComponent } from './pages/financial-plan-explorer/financial-plan-explorer.component';
import { BudgetHierarchyTreeComponent } from './components/budget-hierarchy-tree/budget-hierarchy-tree.component';
import { ChecklistDatabase } from './providers/budget-tree.provider';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MultiLangModule,
    MaterialDesignModule,
    MaterialBricksModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    UserStateModule,

    iTalPageModule,

    BudgetExplorerBurnchartModule,
    BudgetsStateModule,
    BudgetPlanningFeatureModule,

    BudgetExplorerRouter,
    BudgetRenderingStateModule,
  ],

  providers: [
    FinancialPlanExplorerPageComponent,
    ChecklistDatabase
  ],

  declarations: [
    FinancialPlanExplorerPageComponent,

    YearFocusComponent,
    FinancialPlanPlTablesComponent,
    FinancialPlanTableComponent,

    FinancialPlanResultTableComponent,
    LinkBudgetModalComponent,
    BudgetHierarchyTreeComponent,
    // FinancialPlanBurnChartComponent,

    // FinancialPlanPlTablesComponent, FinancialPlanResultTableComponent,
    // , FinancialPlanTableComponent, PlTableContextMenuComponent,

    // LinkBudgetModalComponent]
  ],
})
export class BudgetExplorerFeatureModule {}
