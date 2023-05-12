import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

// import { AppClaimDomains } from '@app/model/access-control';

@Component({
  selector: 'kujali-invoices-header',
  templateUrl: './invoices-header.component.html',
  styleUrls: ['./invoices-header.component.scss']
})
export class InvoicesHeaderComponent implements OnInit {

  @Input() invoiceNumber: string;
    
  @Output() saveInvoiceProgressEvent = new EventEmitter();
  @Output() deleteInvoiceEvent = new EventEmitter();
  @Output() copyInvoiceEvent = new EventEmitter();

  isEditMode: boolean;

  invoiceOperationInProgress: boolean = false;

  // readonly CAN_CREATE_INVOICES = AppClaimDomains.InvCreate;
  // readonly CAN_EDIT_INVOICES = AppClaimDomains.InvEdit;
  // readonly CAN_DELETE_INVOICE = AppClaimDomains.InvDelete;

  constructor(private _router$$: Router) { }
  
  ngOnInit(): void {
    const page = this._router$$.url.split('/')[2];

    if (page != 'create') {
      this.isEditMode = true;
    }
  }

  saveProgress() {
    this.invoiceOperationInProgress = true;
    this.saveInvoiceProgressEvent.emit();
  }

  copyInvoice() {
    this.invoiceOperationInProgress = true;
    this.copyInvoiceEvent.emit();
  }

  deleteInvoice() {
    this.deleteInvoiceEvent.emit();
  }

  goBack(){
    this._router$$.navigate(['business', 'invoices']);
  }
}
