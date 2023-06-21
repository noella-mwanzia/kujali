import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { UserService } from '@ngfi/angular';

import { KuUser } from '@app/model/common/user';

import { PermissionsStore } from '@app/state/organisation';

import { AccessQuery } from '../../base/access-query';
import { _CheckPermission } from '../get-user-role.function';

@Injectable()
export class PerformEditInvoicesActionRightsQuery extends AccessQuery {
  
  constructor(private _permissions$$: PermissionsStore,
              private _user$$: UserService<KuUser>
  ) {
    super();
  }

  protected override _hasViewAccess(): Observable<boolean> {
    return _CheckPermission(
      (p: any) => p.InvoicesSettings.CanEditInvoices,
      this._permissions$$,
      this._user$$
    );
  }

  /** Disable read-access to admin actions */
  protected override _hasReadAccess = () => of(false);
}