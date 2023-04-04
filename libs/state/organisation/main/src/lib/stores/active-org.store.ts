import { Inject, Injectable, OnDestroy } from '@angular/core';

import { combineLatest } from 'rxjs';
import { filter } from 'rxjs/operators';

import { User } from '@iote/bricks';
import { Store } from '@iote/state';

import { UserStore } from '@app/state/user';
import { Organisation } from '@app/model/organisation';

import { OrgStore } from './organisation.store';

@Injectable()
export class ActiveOrgStore extends Store<Organisation> implements OnDestroy
{
  protected store = 'active-org-store';
  protected _activeOrg : string;

  constructor(_orgStore: OrgStore,
              _user$$: UserStore,
              @Inject('ELEWA_PRIV') _noInit: boolean = false)
              // _router: Router)
  {
    super(null as any);

    const orgs$ = _orgStore.get();
    // const route$ = _router.events.pipe(filter((ev: Event) => ev instanceof NavigationEnd),
    //                                    map(ev => ev as NavigationEnd));

    if(!_noInit)
    {
      this._sbS.sink = combineLatest([orgs$, _user$$.getUser()]) // route$])
                          .subscribe(([orgs, user]) => //route
      {
        const orgId = (user as User).id as string;

        
        const org = orgs.find(o => o.id === orgId);
        if(org && this._activeOrg !== orgId)
        {
          this._activeOrg = orgId;
          this.set(org, 'UPDATE - FROM DB || ROUTE');
        }
      });
    }
  }

  override get = () => super.get().pipe(filter(val => val != null));
  
  ngOnDestroy = () => this._sbS.unsubscribe();
}

// private _getRoute(route: NavigationEnd) : string
// {
//   const elements = route.url.split('/');
//   const propId = elements.length >= 3 ? elements[2] : '__noop__';

//   return propId;
// }

// const orgId = this._getRoute(route);

// if(orgId !== '__noop__')
// {
//   const org = orgs.find(o => o.id === orgId);

//   if(org && this._activeOrg !== orgId)
//   {
//     this._activeOrg = orgId;
//     this.set(org, 'UPDATE - FROM DB || ROUTE');
//   }
// }
