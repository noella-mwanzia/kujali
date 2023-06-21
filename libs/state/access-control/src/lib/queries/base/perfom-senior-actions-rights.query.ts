import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserService } from '@ngfi/angular';

import { KuUser } from '@app/model/common/user';

import { AccessQuery } from '../../base/access-query';

@Injectable()
export class PerformSeniorActionRightsQuery extends AccessQuery
{
  private _user: KuUser;

  constructor(private _userService: UserService<KuUser>)
  { super(); }

  // protected _hasWriteAccess() : Observable<boolean>
  // {
  //   return this._userService.getUser().pipe(
  //     map((user)=> !!user && user.roles?.senior!)
  //   );
  // }

  // protected _hasViewAccess() : Observable<boolean>
  // {
  //   return this._userService.getUser().pipe(
  //     map((user)=> !!user && user.roles?.senior!)
  //   );
  // }

  // protected _hasDeleteAccess(): Observable<boolean> {
  //   return this._userService.getUser().pipe(
  //     map((user)=> !!user && user.roles?.senior!)
  //   );
  // }

  // protected _hasSeniorAccess(): Observable<boolean> {
  //   return this._userService.getUser().pipe(
  //     map((user)=> !!user && user.roles?.senior!)
  //   );
  // }

  /** Disable read-access to admin actions */
  protected override _hasReadAccess = () => of(false);
}