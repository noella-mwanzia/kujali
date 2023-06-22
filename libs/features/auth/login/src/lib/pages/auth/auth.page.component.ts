import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs';

import { User } from '@iote/bricks';
import { TranslateService } from '@ngfi/multi-lang';

import { UserStore } from '@app/state/user';

import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth.page.component.html',
  styleUrls: ['./auth.page.component.scss']
})
export class AuthPageComponent implements OnInit, OnDestroy {
  private _userSubscr: Subscription;
  user$: Observable<User>;
  userHasAccess: boolean = false;

  isLogin = true;
  isLoading = true;

  lang = 'en';

  constructor(userService: UserStore,
              private _router$$: Router,
              private _authService: AuthenticationService,
              private _translateService: TranslateService,
  ) {
    this.user$ = userService.getUser();
  }

  ngOnInit() {
    this.lang = this._translateService.initialise();
    this._userSubscr = this.user$.subscribe(user => {
      if (user != null) {
        if (user.roles.access == true) {
          this.userHasAccess = true;
          const userDetails: any = user.profile;
          if (userDetails.activeOrg && userDetails.orgIds && userDetails.activeOrg != '' && userDetails.orgIds.length > 0) {
            this._router$$.navigate(['/home']);
          } else {
            this._router$$.navigate(['/orgs']);
          }
        }
      } else {
        this._router$$.navigate(['/auth/login']);
      }
      this.isLoading = false;
    });
  }

  setLang(lang: 'en' | 'fr') {
    this._translateService.setLang(lang);
  }

  toggleMode() {
    this.isLogin = false;

    if (!this.isLogin)
      this._router$$.navigate(['/auth/register']);
  }

  logInWithGoogle() {
    return this._authService.loginGoogle();
  }

  logInWithMicrosoft() {
    return this._authService.loginMicrosoft();
  }

  toggleModeLogin() {
    this.isLogin = true;

    if (this.isLogin)
      this._router$$.navigate(['/auth/login']);
  }

  createAccount = () => this.toggleMode();

  ngOnDestroy() {
    if (this._userSubscr)
      this._userSubscr.unsubscribe();
  }
}
