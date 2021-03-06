import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserAuthRoutingModule } from './user-auth-routing.module';
import { ForgotComponent } from './pages/forgot/forgot.component';
import { ForgotRedirectComponent } from './pages/forgot-redirect/forgot-redirect.component';
import { ConfirmPasswordComponent } from './pages/confirm-password/confirm-password.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ProfileEditComponent } from './pages/profile-edit/profile-edit.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from '../../shared/material.module';
import { UserStateService } from '../../shared/services/user-state.service';
import { AuthComponent } from './pages/auth/auth.component';
import { RegistrationComponent } from './pages/auth/components/registration-form/registration.component';
import { LoginComponent } from './pages/auth/components/login-form/login.component';
import { AuthMethodsComponent } from './pages/auth/components/auth-methods/auth-methods.component';

@NgModule({
  imports: [CommonModule, UserAuthRoutingModule, ReactiveFormsModule, FormsModule, MaterialModule],
  declarations: [
    LoginComponent,
    RegistrationComponent,
    ForgotComponent,
    ForgotRedirectComponent,
    ConfirmPasswordComponent,
    ProfileComponent,
    ProfileEditComponent,
    AuthMethodsComponent,
    AuthComponent
  ],
  providers: [UserStateService]
})
export class UserAuthModule {}
