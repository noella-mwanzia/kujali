import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { User } from '@iote/bricks';
import { UserService } from '@ngfi/angular';

// import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
 // styleUrls: ['./home.component.scss']
})
export class DashboardPageComponent
{
  user$: Observable<User>;
  loading = true;
  
  constructor(_userService: UserService<User>)
  {
    this.user$ = _userService.getUser();
    
    this.user$.subscribe(() => this.loading = false);
  }
  
}
