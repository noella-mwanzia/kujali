import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";

import { SubSink } from "subsink";
import { combineLatest, Observable, of } from "rxjs";

import { Invoice } from "@app/model/finance/invoices";

import { CompaniesStore } from "@app/state/finance/companies";
import { ContactsStore } from "@app/state/finance/contacts";

import { InvoiceFormsService } from "../services/invoice-forms.service";

import { __CreateCompanyForm, __CreateInvoiceMainForm, __CreateCustomerForm } from "./invoice-forms.model";
import { InvoicesService } from "@app/state/finance/invoices";
import { take, tap } from "rxjs/operators";
import { Company } from "@app/model/finance/companies";
import { Contact } from "@app/model/finance/contacts";
// import { PermissionsStateService } from "@app/state/orgs";
import { KujaliPermissions } from "@app/model/organisation";

export class InvoiceModel {
  private _sbS = new SubSink();

  activeInvoice$: Observable<Invoice>;
  activeInvoice: Invoice;

  mainInvoiceFormGroup: FormGroup;
  companyFormGroup: FormGroup;
  customerFormGroup: FormGroup;

  orderProducts: any;
  productsArray: FormArray;

  companies$: Observable<Company[]>;
  contacts$: Observable<Contact[]>;

  canEditInvoice: boolean = true;

  constructor(_fb: FormBuilder,
              private _companies$$: CompaniesStore,
              private _contacts$$: ContactsStore,
              private _invoiceService: InvoicesService,
              private _invoiceFormService$$: InvoiceFormsService,
          // private _permissionsService: PermissionsStateService
  ) {
    this.companies$ = this._companies$$.get();
    this.contacts$ = this._contacts$$.get();

    this.mainInvoiceFormGroup = __CreateInvoiceMainForm(_fb);
    this.companyFormGroup = __CreateCompanyForm(_fb);
    this.customerFormGroup = __CreateCustomerForm(_fb);
  }

  addNewProduct() {
    this.productsArray = this.mainInvoiceFormGroup.get('products') as FormArray;
    this.productsArray.push(this._invoiceFormService$$.newProduct())
  }

  getActiveInvoice() {
    return this._invoiceService.getActiveInvoice().pipe(tap((invoice) => {
      if (invoice) {
        this.activeInvoice = invoice;
        this.orderProducts = invoice.products;

        this.mainInvoiceFormGroup = this._invoiceFormService$$._initMainForm(invoice, true);

        this.productsArray = this.mainInvoiceFormGroup.get('products') as FormArray;

        this.orderProducts.map((element: any, index) => {
          this.productsArray.push(this._invoiceFormService$$._initProducts(element));
        })

        this._checkPermissions();
      }
    }))
  }


  getInvoiceBaseOrder() {
    // this._sbS.sink = this._ordersService$$.getActiveOrder().subscribe((order) => {
    //   if (order) {
    //     this.orderProducts = order.products;
    //     this.mainInvoiceFormGroup = this._invoiceFormService$$._initMainForm(order, false);       
    //     this.productsArray = this.mainInvoiceFormGroup.get('products') as FormArray;

    //     this.orderProducts.map((element: any, index) => {            
    //       this.productsArray.push(this._invoiceFormService$$._initProducts(element));
    //     })
    //   }
    // })
  }

  _checkPermissions() {
    // this._sbS.sink = this._permissionsService.checkAccessRight((p: kujaliPermissions) => p.InvoicesSettings.CanEditInvoices)
    //   .pipe(take(1))
    //   .subscribe((permissions) => {
    //     if (permissions == false) {
    //       this.canEditInvoice = permissions;
    //       this.mainInvoiceFormGroup.disable();
    //       this.customerFormGroup.disable();
    //     } else {
    //       this.canEditInvoice = permissions;
    //     }
    //   });

    return of(true)
  }


  get products(): FormArray {
    return this.mainInvoiceFormGroup.get('products') as FormArray;
  }
}