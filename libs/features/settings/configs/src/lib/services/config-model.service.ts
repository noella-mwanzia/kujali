import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { InvoicesPrefixService } from '@app/state/finance/invoices';
import { OpportunityTypesStore } from '@app/state/finance/opportunities';

import { ConfigModel } from '../models/config-model';

@Injectable({
  providedIn: 'root'
})
export class ConfigModelService {
  
  private _state: ConfigModel | null;

  constructor(private _fb: FormBuilder,
              private _oppsType$$: OpportunityTypesStore,
              private _invoicePrefix$$: InvoicesPrefixService
  ) {}

  initModalState(): ConfigModel {
    if (!this._state) {
      const model = new ConfigModel(this._fb, this._oppsType$$, this._invoicePrefix$$);
      this._state = model;
    }

    return this._state as ConfigModel;
  }
  
  getModalState(): ConfigModel {
    if (!this._state) throw new Error('[ConfigModel] State not initialised.');
    return this._state as ConfigModel;
  }

  endModelState() {
    this._state = null;
  }
}
