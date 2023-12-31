import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { combineLatest, of } from 'rxjs';
import { switchMap, tap, filter, map, startWith } from 'rxjs/operators';

import { Logger } from '@iote/bricks-angular';

import { Repository, DataService } from '@ngfi/angular';
import { DataStore } from '@ngfi/state';

import { Tags } from '@app/model/tags';

import { ActiveOrgStore } from '@app/state/organisation';

@Injectable()
export class TagsStore extends DataStore<Tags> {
  protected store = 'tags-store';
  protected _activeRepo: Repository<Tags>;

  constructor(private _dataProvider: DataService,
              private _activeOrg$$: ActiveOrgStore,
              private _router$$: Router,
              protected override _logger: Logger
  ) 
  {
    super('always', _logger);

    const route$ = _router$$.events.pipe(
      filter((ev: any) => ev instanceof NavigationEnd),
      map((ev) => ev as NavigationEnd)
    );

    const data$ = combineLatest([_activeOrg$$.get(), route$.pipe(startWith('companies'))])
    .pipe(tap(([o, r]) => {
        const store = this._router$$.url.split('/')[2] + '-tags';
        this._activeRepo = !!o ? _dataProvider.getRepo<Tags>(`orgs/${o.id}/${store}`) : (null as any);
      }),
      switchMap((r) =>
        !!this._activeRepo ? this._activeRepo.getDocuments() : of([])
      )
    );

    this._sbS.sink = data$.subscribe((tags) => {
      this.set(tags, 'UPDATE - FROM DB');
    });
  }

  override get() {
    return super.get().pipe(filter((tags, i) => !!tags && tags.length >= 0));
  }
}
