import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistrationComponent } from './pages/registration/registration.component';
import { LoginComponent } from './pages/login/login.component';
import { ForgotComponent } from './pages/forgot/forgot.component';
import { ForgotRedirectComponent } from './pages/forgot-redirect/forgot-redirect.component';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { ConfirmPasswordComponent } from './pages/confirm-password/confirm-password.component';

const routes: Routes = [
  {
    path: 'signup',
    component: RegistrationComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'forgot',
    component: ForgotComponent,
    children: [
      {
        path: 'redirect/:token',
        component: ForgotRedirectComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'redirect',
        component: ForgotRedirectComponent
      }
    ]
  },
  {
    path: 'forgot/:tokenError',
    component: ForgotComponent
  },
  {
    path: 'confirmation',
    component: ConfirmPasswordComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserAuthRoutingModule { }
