//
// This file is licensed under the "Elewa Commercial License v1"
// All rights reserved.
//
import { Injectable } from '@angular/core';

import { combineLatest } from 'rxjs';

import { User } from '@iote/bricks';
import { Logger } from '@iote/bricks-angular';
import { LocalPersistanceService } from '@iote/local-persistance';

import { Organisation } from '@app/model/organisation';

import { UserStore } from '@app/state/user';
import { ActiveOrgStore, OrgStore } from '@app/state/organisation';

@Injectable()
export class MtActiveOrgStore extends ActiveOrgStore
{
  protected override store = 'mt-active-org-store';

  constructor(_orgStore: OrgStore,
              _user$$: UserStore,
              private _lpS: LocalPersistanceService,
              private _logger: Logger)
              // _router: Router)
  {
    super(_orgStore, _user$$, true);

    const orgs$ = _orgStore.get();

    this._sbS.sink = combineLatest([orgs$, _user$$.getUser()]) // route$])
                        .subscribe(([orgs, user]) => //route
    {
      const org = this._getActiveOrg(orgs, user);
     
      if(org && this._activeOrg !== org.id)
      {
        this._activeOrg = org.id as string;
        this.set(org, 'UPDATE - FROM DB || LS');
      }
    });
  }

  /** 
   * Get the active organisation from browser/app local storage.
   */
  private _getActiveOrg(orgs: Organisation[], user: User)
  {
    // Determening org from a route-based strategy is impractical here,
    //   as routes would then need to be synced with the single tenant.
    const orgId = this._lpS.get(`oId_${user.id}`) as string;
   
    if(!orgId) {
      this._logger.warn(() => `No orgId set for user.`)
      // TODO: routing to organisation setup from here if orgId not set?
      return null;
    }

    // Get the org from orgs the user is looking at
    const org = orgs.find(o => o.id === orgId);

    return org;
  }
}
