import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { FlexLayoutModule, MaterialBricksModule, MaterialDesignModule } from '@iote/bricks-angular';

import { iTalPageModule } from '@app/elements/layout/page';

// import { TransactionTypeManagementModule } from '../transaction-type-management/transaction-type-management.module';
// import { FinancialPlanExplorerModule } from '../financial-plan-explorer/financial-plan-explorer.module';

import { FinancialPlanningHomeComponent } from './components/financial-planning-home/financial-planning-home.component';

import { SelectBudgetComponent } from './components/select-budget/select-budget.component';
import { CreateBudgetModalComponent } from './components/create-budget-modal/create-budget-modal.component';

import { DisplayBudgetRecordComponent } from './components/display-budget-record/display-budget-record.component';
import { ShareBudgetModalComponent } from './components/share-budget-modal/share-budget-modal.component';
import { MultiLangModule } from '@ngfi/multi-lang';

/**
 * Financial-Planning module. Contains financial planning creation and forecasting.
 */
@NgModule({
  imports: [CommonModule, MaterialBricksModule, MaterialDesignModule, FlexLayoutModule,
            RouterModule, FormsModule,// CustomFormsModule,
            
            // TransactionTypeManagementModule, FinancialPlanExplorerModule,
            
            MultiLangModule,
            iTalPageModule
            // UserModule
  ],

  declarations: [FinancialPlanningHomeComponent, SelectBudgetComponent, DisplayBudgetRecordComponent, 
                 CreateBudgetModalComponent, ShareBudgetModalComponent],

  entryComponents: [CreateBudgetModalComponent, ShareBudgetModalComponent],

  providers: [],
  
  exports: [FinancialPlanningHomeComponent],

})
export class FinancialPlanningModule { }
