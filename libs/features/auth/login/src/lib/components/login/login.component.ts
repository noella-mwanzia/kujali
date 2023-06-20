import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EventLogger } from '@iote/bricks-angular';

import { AuthService } from '@ngfi/angular';

import { ForgotPasswordModalComponent } from '../../modals/forgot-password-modal/forgot-password-modal.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent
{

  @Output() createAccount = new EventEmitter()

  email     = '';
  password  = '';

  isLogin = true;
  isLoading = false;
  showLoginError = false;

  constructor( private _authService: AuthService,
              private _dialog: MatDialog,
              private _analytics: EventLogger)
  {  }

  validateLoginCred = () => this.email && this.password;

  // When user clicks enter, try log in.
  detectEnter = (event: any) => (event.key === "Enter") ? this.loginUser() : 'noop';

  loginUser()
  {
    this.isLoading = true;

    if(this.validateLoginCred())
      this._authService.loginWithEmailAndPassword(this.email, this.password)
                      .then(()=> this._analytics.logEvent('login'))
                      .catch((error) => {
                        this.isLoading = false;
                        this.showLoginError = true;
                        this._analytics.logEvent('login_error', {"errorMsg": error})
                      });
  }

  forgotPass() {
    this._dialog
          .open(ForgotPasswordModalComponent, {
            width: '500px'
          });
  }

  toggleMode = () => this.isLogin = ! this.isLogin;

  navigateToCreateAccount = () => this.createAccount.emit();
}
