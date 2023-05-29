import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { SubSink } from 'subsink';

import  * as html2pdf from 'html2pdf.js'

import { flatMap as __flatMap, round as __round, groupBy as __groupBy } from 'lodash';

import { Company } from '@app/model/finance/companies';

import { OpportunitiesService } from '@app/state/finance/opportunities';
import { InvoicesPrefixService } from '@app/state/finance/invoices';
import { Invoice } from '@app/model/finance/invoices';

@Component({
  selector: 'kujali-invoice-pdf',
  templateUrl: './invoice-pdf.component.html',
  styleUrls: ['./invoice-pdf.component.scss']
})
export class InvoicePdfComponent implements OnInit {

  private _sbS = new SubSink();

  subTotal      : number;
  vatTotal      : number;
  finalTotal    : number;

  invoiceCurrency : string;
  invoiceNumber   : string;
  invoiceNote     : string;
  downloadURL     : string;

  invoiceData   : any;
  companyData   : any;
  customerData  : any;
  uniqueVat     : any;
  
  base64CompanyLogo: any;
  imageLoaded: boolean = false;

  constructor(private dialog: MatDialog,
              public dialogRef: MatDialogRef<InvoicePdfComponent>,
              @Inject(MAT_DIALOG_DATA) public invoiceFormData: any,
              private _oppsService: OpportunitiesService,
              private _invPrefix$$: InvoicesPrefixService
  ) { }

  ngOnInit(): void {

    this._invPrefix$$.getInvoicePrefix().subscribe((invoicePrefix)=>{
      this.invoiceNote = invoicePrefix.extraNote
    });

    this.companyData = this.invoiceFormData.company;
    this.customerData = this.invoiceFormData.customer;
    this.invoiceData = this.invoiceFormData.invoice;    
    this.invoiceCurrency = this.invoiceFormData.currency;
    this.invoiceNumber = this.invoiceFormData.invoiceNumber;    

    if (this.invoiceData) {
      this.getSubToTal();
    }

    if (this.companyData.logoImgUrl != '') {
      this.toDataURL(this.companyData.logoImgUrl).then((imageBase) => {
        this.base64CompanyLogo = imageBase;
        this.imageLoaded = true;
      });
    } else {
      this.base64CompanyLogo = '';
      this.imageLoaded = true;
    }
  }

  getDate(date) {
    return date ? date.format('DD-MM-YYYY') : '';
  }

  getContactName(contactId: string): string {
    return contactId ? this._oppsService.getContactNames(contactId): '';
  }

  getItemTotal(item: any): number {
    let total = item.qty * item.cost
    return total - (total * (item.discount/100));
  }

  getVat(vat: any) {
    var totalVatResult = vat.reduce(function (invoice: any, value: any) {
      return invoice + value.vat;
    }, 0);
    let uVat = {
      vat: vat[0].vatPercent,
      total: __round(totalVatResult, 2)
    }
    return uVat;
  }

  getFormValues(invoices: any) {
    let totals: any = invoices.map((invoice) => {        
      const total =
      invoice.cost * invoice.qty - (invoice.cost * invoice.qty * invoice.discount) / 100;
      return {
        totalSum: total,
        vat: total * (invoice.vat / 100),
        vatPercent: invoice.vat
      };
    });    
    return totals;
  }

  getSubToTal() {    
    let totals = this.getFormValues(this.invoiceData.products);
    
    let vats = __groupBy(totals, 'vatPercent');
    this.uniqueVat = Object.values(vats);     
    
    var totalResult = totals.reduce(function (invoice: any, value: any) {
      return invoice + value.totalSum;
    }, 0);

    var totalVatResult = totals.reduce(function (invoice: any, value: any) {
      return invoice + value.vat;
    }, 0);

    this.subTotal = __round(totalResult, 2);    
    this.vatTotal = __round(totalVatResult, 2);
    this.finalTotal = this.subTotal + this.vatTotal;    
  }

  downloadPdf() {
    var element = document.getElementById('invoice-pdf');
    var opt = {
      margin:       0.5,
      filename:     this.invoiceNumber + '.pdf',
      image:        { type: 'png', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    html2pdf(element, opt);
  }

  toDataURL = url => fetch(url).then(response => response.blob())
    .then(blob => new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    }
  ))

  closeDialog() {
    this.dialog.closeAll();
  }
}
