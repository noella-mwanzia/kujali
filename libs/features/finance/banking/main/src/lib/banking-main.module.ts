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

import { PageHeadersModule } from '@app/elements/layout/page-headers';
import { iTalPageModule } from '@app/elements/layout/page';

import { SingleAccountPageComponent } from './components/single-account-page/single-account-page.component';
import { TransactionsTableComponent } from './components/transactions-table/transactions-table.component';
import { AccountInformationComponent } from './components/account-information/account-information.component';

import { BankingPageComponent } from './pages/banking-page/banking-page.component';

import { CreateNewBankAccountModalComponent } from './modals/create-new-bank-account-modal/create-new-bank-account-modal.component';

import { BankingRouterModule } from './banking.router';

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

    PageHeadersModule,
    iTalPageModule,

    BankingRouterModule,
  ],
  declarations: [
    BankingPageComponent,
    CreateNewBankAccountModalComponent,
    SingleAccountPageComponent,
    AccountInformationComponent,
    TransactionsTableComponent,
  ],
})
export class FinanceBankingModule {}
