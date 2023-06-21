import { FormArray, FormBuilder, FormGroup } from "@angular/forms";

import { InvoicesPrefix } from "@app/model/finance/invoices";
import { OpportunityTypes } from "@app/model/finance/opportunities";

import { InvoicesPrefixService } from "@app/state/finance/invoices";
import { OpportunityTypesStore } from "@app/state/finance/opportunities";

import { CreateInvoicePrefixForm, CreateOpportunityColorsForm, CreateOpportunityTypesForm } from "./config-forms.model";

export class ConfigModel 
{
  opportunityTypesForm: FormGroup;
  quotesPrefixGroup: FormGroup;
  invoicePrefixGroup: FormGroup;

  constructor(private _fb: FormBuilder,
              private _oppsTypes$$: OpportunityTypesStore,
              private _invoicePrefix$$: InvoicesPrefixService
  )
  {
    this.opportunityTypesForm = CreateOpportunityTypesForm(_fb);
    this.invoicePrefixGroup = CreateInvoicePrefixForm(_fb);
  }

  getOpportunityTypesArray() : FormArray {
    return this.opportunityTypesForm.get('opportuniTypesArray') as FormArray;
  }

  patchOpportunityTypes(oppsT: OpportunityTypes) {
    if (oppsT.labels) {
      oppsT.labels.forEach((label) => {
        this.getOpportunityTypesArray().push(CreateOpportunityColorsForm(this._fb, label));
      })
    }
    this.opportunityTypesForm.disable();
  }

  patchInvoicePrefix(invoicePrefix: InvoicesPrefix) {
    this.invoicePrefixGroup.setValue(
      { 
        invoicesPrefix: invoicePrefix.prefix, 
        currentInvoiceNumber: invoicePrefix.number, 
        extraNote: invoicePrefix.extraNote,
        termsAndConditionsDocUrl: invoicePrefix.termsAndConditionsDocUrl
      });
    this.invoicePrefixGroup.disable();
  }
}