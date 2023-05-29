import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Observable } from 'rxjs';

import { __DateFromStorage } from '@iote/time';

import { KuUser } from '@app/model/common/user';
import { Activity } from '@app/model/finance/activities';

import { OrganisationService } from '@app/state/organisation';

import { AddNewActionModel } from '../model/add-new-action.model';

@Injectable({
  providedIn: 'root',
})
export class AddNewActionModelService {
  private _state: AddNewActionModel | null;

  constructor(private _fb: FormBuilder,
              private _activeOrg$$: OrganisationService,
  ) {}

  initModalState(_page: string): AddNewActionModel {
    if (!this._state) {
      const model = new AddNewActionModel(this._fb, _page);
      this._state = model;
    }

    return this._state as AddNewActionModel;
  }

  getModalState(): AddNewActionModel {
    if (!this._state) throw new Error('[AddNewActionModel] State not initialised.');
    return this._state as AddNewActionModel;
  }

  _initForm(action: Activity): FormGroup {
    return this._fb.group({
      id: [action.id],
      title: [action.title],
      desc: [action.desc],
      type: [action.type],
      startDate: [new Date(action.startDate.seconds * 1000)],
      endDate: [new Date(action.endDate.seconds * 1000)],
      assignTo: [action.assignTo],
    });
  }

  getAllOrgUsers(): Observable<KuUser[]> {
    return this._activeOrg$$.getOrgUsersDetails();
  }

  endModelState() {
    this._state = null;
  }
}
