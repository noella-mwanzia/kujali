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

import { AllocateTransactionModalComponent } from './modals/allocate-transaction-modal/allocate-transaction-modal.component';
import { AllocatePaymentsToInvoiceComponent } from './modals/allocate-payments-to-invoice/allocate-payments-to-invoice.component';
import { AllocatedInvoiceComponent } from './components/allocated-invoice/allocated-invoice.component';
import { PaymentsTableComponent } from './components/payments-table/payments-table.component';
import { InvoicesTableComponent } from './components/invoices-table/invoices-table.component';
import { AllocatedPaymentComponent } from './components/allocated-payment/allocated-payment.component';

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
  ],
  declarations: [
    AllocateTransactionModalComponent,
    AllocatePaymentsToInvoiceComponent,
    AllocatedInvoiceComponent,
    PaymentsTableComponent,
    InvoicesTableComponent,
    AllocatedPaymentComponent,
  ],
})
export class AllocationsModule {}
