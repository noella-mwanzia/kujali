import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { OpportunitiesService } from '@app/state/finance/opportunities';

import { OpportunitiesEditModel } from '../model/opportunities-edit.model';

@Injectable({
  providedIn: 'root'
})
export class OpportunitiesEditModelService {
  private _state: OpportunitiesEditModel | null;

  constructor(private _fb: FormBuilder,
              private _oppsService: OpportunitiesService
  ) { }

  initModalState(): OpportunitiesEditModel {
    if (!this._state) {
      const model = new OpportunitiesEditModel(this._fb, this._oppsService);
      this._state = model;
    }

    return this._state as OpportunitiesEditModel;
  }

  getModalState(): OpportunitiesEditModel {
    if (!this._state) throw new Error('[OpportunitiesEditModel] State not initialised.');
    return this._state as OpportunitiesEditModel; 
  }

  endModelState() {
    this._state = null;
  }
}
