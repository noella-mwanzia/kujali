import { Component, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

import { User } from '@iote/bricks';
import { UserService } from '@ngfi/angular';
import { MetabaseService } from '@app/state/organisation';

// import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
 styleUrls: ['./dashboard.page.scss']
})
export class DashboardPageComponent
{
  user$: Observable<User>;
  loading = true;

  iframeUrl: string;

  constructor(_userService: UserService<User>,
              private _mbService: MetabaseService)
  {
    this.user$ = _userService.getUser();
    
    this.user$.subscribe(() => this.loading = false);

    //Call backend fn that generates metabase link
    this._mbService.getMetabaseLink().subscribe(res => {
      this.iframeUrl = res;
    });

  }

}
