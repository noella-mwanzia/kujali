import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialDesignModule, MaterialBricksModule, FlexLayoutModule, MaterialFormBricksModule } from '@iote/bricks-angular';

import { InvoicePdfComponent } from './pdf/invoice-pdf/invoice-pdf.component';

import { InvoicesPdfService } from './services/invoices-pdf.service';

@NgModule({
  imports: [
    CommonModule,

    MaterialDesignModule,
    FlexLayoutModule,
    MaterialFormBricksModule,
    MaterialBricksModule
  ],
  declarations: [
    InvoicePdfComponent
  ],
  exports: [InvoicePdfComponent],
  providers: [InvoicesPdfService]
})
export class InvoiceDocumentsModule {}
