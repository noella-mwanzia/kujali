import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserService } from '@ngfi/angular';

import { KuUser } from '@app/model/common/user';

import { AccessQuery } from '../../base/access-query';

@Injectable()
export class PerformActionRightsQuery extends AccessQuery
{
  private _user: KuUser;

  constructor(private _userService: UserService<KuUser>)
  { super(); }

  protected override _hasWriteAccess() : Observable<boolean>
  {
    return this._userService.getUser().pipe(
      map((user)=> !!user && user.roles[user.profile.activeOrg].admin!)
    );
  }
}