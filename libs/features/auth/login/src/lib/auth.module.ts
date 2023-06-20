import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialDesignModule, MaterialBricksModule, FlexLayoutModule } from '@iote/bricks-angular';

import { UserStateModule } from '@app/state/user';
import { MultiLangModule } from '@ngfi/multi-lang';

import { iTalPageModule } from '@app/elements/layout/page';

import { LoginComponent }            from './components/login/login.component';
import { RegisterComponent }         from './components/register/register.component';
import { ForgotPasswordModalComponent }       from './modals/forgot-password-modal/forgot-password-modal.component';

import { AuthPageComponent } from './pages/auth/auth.page.component';
import { AuthenticationService } from './services/authentication.service';

import { AuthRouterModule }  from './auth-router.module';

/**
 * Auth module. Contains the auth of the app and Base Access Control.
 */
@NgModule({
  imports: [CommonModule, RouterModule, MultiLangModule,
            MaterialDesignModule, MaterialBricksModule, FlexLayoutModule,
            FormsModule, ReactiveFormsModule,
            UserStateModule,

            iTalPageModule,

            AuthRouterModule],

  declarations: [LoginComponent,
                 RegisterComponent, ForgotPasswordModalComponent,

                  AuthPageComponent],

  exports: [],
  providers: [AuthenticationService]
})
export class AuthModule { }
