import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

import { combineLatest, Observable } from 'rxjs';

import { UserService } from '@ngfi/angular';
import { TranslateService } from '@ngfi/multi-lang';

import { KujaliPermissions } from '@app/model/organisation';
import { KuUser } from '@app/model/common/user';

import { PermissionsStore } from '@app/state/organisation';
import { _CheckPermission } from '@app/state/access-control';

@Injectable({
  providedIn: 'root',
})
export class PermissionsStateService {

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  
  constructor(private _snackBar: MatSnackBar,
              private _translateService: TranslateService,
              private _permissions$$: PermissionsStore,
              private _user$$: UserService<KuUser>
  ) {}

  getPermissions(): Observable<[KujaliPermissions, KuUser]> {
    return combineLatest([this._permissions$$.get(), this._user$$.getUser()]);
  }

  checkAccessRight(p: any): Observable<boolean> {
    return _CheckPermission(p, this._permissions$$, this._user$$);
  }

  throwInsufficientPermissions() {
    this._snackBar.open(
      this._translateService.translate('You do not have sufficient permissions, contact administrator'),
      'Close',
      {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: 2000,
      }
    );
  }
}
