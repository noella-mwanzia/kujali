import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SubSink } from 'subsink';
import { Observable, Subject } from 'rxjs';

import { __DateToStorage } from '@iote/time';
import { TranslateService } from '@ngfi/multi-lang';

import { KuUser } from '@app/model/common/user';
import { Activity } from '@app/model/finance/activities';

import { ActivitiesService } from '@app/state/finance/activities';

import { ActionsPermissionsService } from '../../services/actions-permissions.service';

import { AddNewActionModel } from '../../model/add-new-action.model';
import { AddNewActionModelService } from '../../services/add-new-action-model.service';

@Component({
  selector: 'add-new-activity',
  templateUrl: './add-new-activity.component.html',
  styleUrls: ['./add-new-activity.component.scss'],
})

export class AddNewActivityComponent implements OnInit {
  private _sbS = new SubSink();

  public model: AddNewActionModel;

  @Input() action : Observable<Activity>;

  actionData: Subject<Activity> = new Subject();

  defaultType: string = 'Meeting';

  orgUsers: KuUser[];
  filteredUsers: KuUser[];

  actionId: string;
  _page: string;

  editMode: boolean;
  formSubmitted: boolean;

  lang: 'fr' | 'en' | 'nl';

  canCreateActions: boolean;
  canDeleteActions: boolean;

  constructor(private _translateService: TranslateService,
              private _router$$: Router,
              private _activitiesService: ActivitiesService,
              private _permissionsService: ActionsPermissionsService,
              private _addNewActionModelService: AddNewActionModelService
  ) {}

  ngOnInit(): void {
    this._page = this._router$$.url.split('/')[2];
    this.lang = this._translateService.initialise();

    this._getOrgUsers();
    this.model = this._addNewActionModelService.initModalState(this._page[2]);

    this.editActionChanged();
    this._checkCreatePermissions();
    this._checkDeletePermissions();
  }

  setLang(lang: 'en' | 'fr' | 'nl') {
    this._translateService.setLang(lang);
  }

  private _checkCreatePermissions() {
    this._sbS.sink = this._permissionsService.checkCreatePermissions(this._page).subscribe((permissions) => {
      if (permissions == true) {
        this.canCreateActions = true;
      }
    })
  }

  private _checkDeletePermissions() {
    this._sbS.sink = this._permissionsService.checkDeletePermissions(this._page).subscribe((permission) => {
      if (permission == true) {
        this.canDeleteActions = true;
      }
    })
  }

  private _getOrgUsers() {
    this._sbS.sink = this._addNewActionModelService
      .getAllOrgUsers()
      .subscribe((users) => {
        this.orgUsers = users;
        this.filteredUsers = this.orgUsers.slice();
      });
  }

  editActionChanged() {
    this._sbS.sink = this.action.subscribe((actionData) => {
      if (actionData) {
        this.model.addNewActionFormGroup = this._addNewActionModelService._initForm(actionData);
        this.editMode = true;
        this.actionId = actionData.id!;
      }
    })
  }

  addNewAction() {
    this.formSubmitted = true;

    if (!this.model.addNewActionFormGroup.hasError('formHasError')) 
    {
      this.editMode ? this.updateAction() : this.createNewAction();
      this.formSubmitted = false;
      this.resetActionForm();
      this.formSubmitted = false;
    }
  }

  createNewAction() {    
    this._activitiesService.submitAction(this.model.addNewActionFormGroup);
  }

  updateAction() {
    this.model.addNewActionFormGroup.value.id = this.actionId;
    let action = {...this.model.addNewActionFormGroup.value} as Activity;
    this._activitiesService.updateAction(action);
    this.editMode = false;
  }

  deleteAction() {
    this._activitiesService.deleteAction(this.model.addNewActionFormGroup.value);
    this.editMode = false;
    this.model.addNewActionFormGroup.patchValue({title : '', desc : '', type : '', assignTo : ''});
  }

  cancelAction () {
    this.editMode = false;
    this.model.addNewActionFormGroup.patchValue({title : '', desc : '', type : '', assignTo : ''});
  }

  cancelEdit = () => (this.editMode = false);

  resetActionForm() {
    this.model.addNewActionFormGroup.patchValue({
      title: '',
      desc: '',
      type: '',
      startDate: new Date(),
      endDate: new Date(),
      assignTo: []
    })
  }
  ngOnDestroy () {
    this._sbS.unsubscribe();
    this._addNewActionModelService.endModelState();
  };
}
