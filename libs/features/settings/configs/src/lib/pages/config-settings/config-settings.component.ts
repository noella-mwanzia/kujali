import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { SubSink } from 'subsink';

import { TypeLabel } from '@app/model/finance/opportunities';

import { OpportunityTypesStore } from '@app/state/finance/opportunities';
import { InvoicesPrefixService } from '@app/state/finance/invoices';

import { CreateOpportunityNewColorsForm } from '../../models/config-forms.model';
import { ConfigModel } from '../../models/config-model';

import { ConfigModelService } from '../../services/config-model.service';
import { ConfigInvoicesService } from '../../services/config-invoices.service';

@Component({
  selector: 'config-settings',
  templateUrl: './config-settings.component.html',
  styleUrls: ['./config-settings.component.scss']
})
export class ConfigSettingsComponent implements OnInit, OnDestroy {
  private _sbS = new SubSink();

  public configModel: ConfigModel;

  isEditOppsMode: boolean = false;
  isEditQuotesMode: boolean = false;
  isEditInvoicesMode: boolean = false;

  arrayIsLoaded: boolean = false;

  constructor(private _fb: FormBuilder,
              private _configModelService$$: ConfigModelService,
              private _opportunityTypes$$: OpportunityTypesStore,
              private _invoicePrefix$$: InvoicesPrefixService,
              private _configInvoicesService$$: ConfigInvoicesService
  ) {}

  ngOnInit(): void {
    this.configModel = this._configModelService$$.initModalState();

    this._sbS.sink = this._opportunityTypes$$.get().subscribe((oppsT) => {
      if (oppsT) {
        this.configModel.getOpportunityTypesArray().clear();
        this.configModel.patchOpportunityTypes(oppsT);
      }
    })

    this._sbS.sink = this._invoicePrefix$$.getInvoicePrefix().subscribe((invoiceT) => {
      if (invoiceT) {
        this.configModel.patchInvoicePrefix(invoiceT);
      }
    })
  }

  addOpportunityType() {
    this.configModel.getOpportunityTypesArray().push(CreateOpportunityNewColorsForm(this._fb));
  }

  removeOpportunityType(index: number) {
    this.configModel.getOpportunityTypesArray().removeAt(index);
  }

  toggleEditMode(editDomain: string) {
    switch (editDomain) {
      case 'opps':
        this.isEditOppsMode = !this.isEditOppsMode;
        if (this.isEditOppsMode){
          this.configModel.opportunityTypesForm.enable();
        } else {
          this.updateOpportunityTypes();
          this.configModel.opportunityTypesForm.disable();
        }
        break;

      case 'invoices':
        this.isEditInvoicesMode = !this.isEditInvoicesMode;
        if (this.isEditInvoicesMode){
          this.configModel.invoicePrefixGroup.enable();
        } else {
          this.saveInvoiceConfigs();
          this.configModel.invoicePrefixGroup.disable();
        }
        break;
    
      default:
        break;
    }
  }

  saveInvoiceConfigs() {
    this._invoicePrefix$$.saveInvoicePrefix(this.configModel.invoicePrefixGroup.value);
  }

  updateOpportunityTypes() {
    let oppsT = this.configModel.getOpportunityTypesArray().value;
    let newT = oppsT.map((type: TypeLabel) => this.capitalizeFirstLetter(type));
    let t = {id: 'opportunity-types', labels: newT}
    this._opportunityTypes$$.create(t);
    this.configModel.getOpportunityTypesArray().clear();
  }

  capitalizeFirstLetter(str: TypeLabel) {
    const capitalized = str.label.charAt(0).toUpperCase() + str.label.slice(1);
    return {label: capitalized, color: str.color};
  }

  onFileSelected(file) {
    this._configInvoicesService$$.uploadTermsPdf(file);
  }

  removeTermsDoc() {
    this._configInvoicesService$$.deleteTermsPdf();
  }

  ngOnDestroy(): void {
    this._configModelService$$.endModelState();
  }
}
