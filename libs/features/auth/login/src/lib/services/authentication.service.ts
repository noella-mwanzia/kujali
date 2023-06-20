import { Injectable } from '@angular/core';
import { AuthService } from '@ngfi/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private _auth$$: AuthService ) { }


  /** Google Login */
  loginGoogle() {
    return this._auth$$.loadGoogleLogin();
  }

  /** Facebook Login */
  loginFacebook() {
    return this._auth$$.loadFacebookLogin();
  }

  /** Microsoft Login */
  loginMicrosoft() {
    return this._auth$$.loadMicrosoftLogin();
  }

}
