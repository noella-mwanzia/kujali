import { Component }    from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { User }                from '@iote/bricks';
import { Logger, EventLogger } from '@iote/bricks-angular';
import { AuthService }         from '@ngfi/angular';

import { TranslateService } from '@ngfi/multi-lang';

@Component({
  selector: 'app-register',
  templateUrl: 'register.component.html',
  styleUrls: ['register.component.scss'],
})
export class RegisterComponent

{
  checkForm: FormGroup;
  registerForm: FormGroup;

  phoneFormat: string;
  confirmPassword: string;
  lang : 'fr' | 'en' | 'nl';

  isValid: boolean;
  isLoading = false;
  accountCreationError = false;

  constructor(private _fb: FormBuilder,
              private _translateService: TranslateService,
              private _authService: AuthService,
              private _analytics: EventLogger,
  ) {
    this._initForm();
    this.lang = this._translateService.initialise();
  }


  setLang(lang: 'en' | 'fr')
  {
    this._translateService.setLang(lang);
  }

  private _initForm()
  {
    this.registerForm = this._fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', [Validators.required]],
      acceptConditions: [ false, [Validators.required]]
    },
    { validator: this._mustMatch('password', 'confirmPassword') });
  }

  doRegister(event: any){
  
    if(this.registerForm.valid)
    {
      this.isLoading = true;
      const frm = this.registerForm.value;
      const firstName = frm.firstName;
      const lastName = frm.lastName;

      const user  = {
        email: frm.email,

        profile: {
          email: frm.email,
          phone: '',
          buildings: {}
        },

        displayName: `${firstName} ${lastName}`,
        roles: {
          access: true,
          active: true
        }
      };

      this._authService.createUserWithEmailAndPassword(
                 `${firstName} ${lastName}`,
                  user.email,
                  frm.password,
                  user.profile,
                  user.roles
                )
            .then(value => this._analytics.logEvent('register', {"userId": (value as User).id}))
            .catch(error => {
              this.isLoading = false;
              this.accountCreationError = true;
              this._analytics.logEvent('register_error', { "errorMsg": error})
            });
    }
  }

  countryChanged($event: any)
  {
    const splitPlaceholder = ($event.placeHolder).split($event.dialCode);
    this.phoneFormat = `${splitPlaceholder[0]}${$event.dialCode}   ${splitPlaceholder[1]}`;
  }

  private _mustMatch(controlName: string, matchingControlName: string)
  {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  formIsInvalid()
  {
    return this.registerForm.invalid || !this.registerForm.value.acceptConditions;
  }

  getTermsLink = () => '';

  getPolicyLink = () => '';
}
