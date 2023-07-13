import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { KuUser } from '@app/model/common/user';

import { UserStore } from '@app/state/user';

import { AddNewOrgRoleModalComponent } from '../modals/add-new-org-role-modal/add-new-org-role-modal.component';
import { DeleteOrgRoleModalComponent } from '../modals/delete-org-role-modal/delete-org-role-modal.component';

@Injectable({
  providedIn: 'root',
})
export class PermissionsModelService {

  constructor(private _dialog: MatDialog,
              private _userService: UserStore
              
  ) {}

  _getOrgUsers(org: string): Observable<KuUser[]> {
    return this._userService.getOrgUsers(org);
  }

  createNewRole(permissions) {
    const dialogRef = this._dialog.open(AddNewOrgRoleModalComponent, {
      minWidth: '500px',
      data: permissions,
    });
  }

  deleteRole(permissions) {
    const dialogRef = this._dialog.open(DeleteOrgRoleModalComponent, {
      minWidth: '500px',
      data: permissions,
    });
  }
}
