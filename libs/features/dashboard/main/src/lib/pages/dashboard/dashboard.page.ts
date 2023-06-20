import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';

import { User } from '@iote/bricks';
import { UserService } from '@ngfi/angular';
import { ExpensesStateService } from '@app/state/finance/operations/expenses';

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

  // iframeUrl: string = "https://elewa-group.metabaseapp.com/embed/dashboard/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXNvdXJjZSI6eyJkYXNoYm9hcmQiOjN9LCJwYXJhbXMiOnt9LCJleHAiOjE2ODY3MjI4ODEsImlhdCI6MTY4NjcyMjI4MH0.LdKttqTStarU2j1GAZRjcQUXEfBBqbYYLYUPvgiTrA8#bordered=true&titled=true";
  // frame = "https://elewa-group.metabaseapp.com/embed/dashboard/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXNvdXJjZSI6eyJkYXNoYm9hcmQiOjN9LCJwYXJhbXMiOnt9LCJleHAiOjE2ODY3NDMwODksImlhdCI6MTY4Njc0MjQ4OX0.nHP5x4WKsNvmCwQveyVc3_Kxl4lz9a--2csI10tNVyM"
  iframeUrl: string = "https://elewa-group.metabaseapp.com";

  constructor(_userService: UserService<User>,
              private sanitizer: DomSanitizer,
              private _test: ExpensesStateService)
  {
    this.user$ = _userService.getUser();
    
    this.user$.subscribe(() => this.loading = false);

    // this._test.testMetabaseLink().subscribe(res => {
    //   debugger;
    //   this.iframeUrl = res;
    // });

  }

}
