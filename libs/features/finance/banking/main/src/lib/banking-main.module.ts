import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  MaterialDesignModule,
  MaterialBricksModule,
  FlexLayoutModule,
} from '@iote/bricks-angular';

import { UserStateModule } from '@app/state/user';
import { MultiLangModule } from '@ngfi/multi-lang';

import { iTalPageModule } from '@app/elements/layout/page';

import { BankingPageComponent } from './pages/banking-page/banking-page.component';
import { BankingRouterModule } from './banking.router';
import { CreateNewBankAccountModalComponent } from './modals/create-new-bank-account-modal/create-new-bank-account-modal.component';

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

    BankingRouterModule,
  ],
  declarations: [BankingPageComponent, CreateNewBankAccountModalComponent],
})
export class FinanceBankingModule {}
