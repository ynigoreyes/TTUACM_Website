import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForgotComponent } from './pages/forgot/forgot.component';
import { ForgotRedirectComponent } from './pages/forgot-redirect/forgot-redirect.component';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { ConfirmPasswordComponent } from './pages/confirm-password/confirm-password.component';
import { AuthComponent } from './pages/auth/auth.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent
  },
  {
    // This is when there is an error validating a forgot password attemp
    path: ':errors',
    component: AuthComponent
  },
  {
    path: 'forgot/:tokenError',
    component: ForgotComponent
  },
  {
    path: 'forgot',
    component: ForgotComponent,
    children: [
      {
        path: 'redirect',
        component: ForgotRedirectComponent,
        pathMatch: 'full'
      },
      {
        path: 'redirect/:token',
        component: ForgotRedirectComponent
      }
      // Take this bottom route out before production
    ]
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
export class UserAuthRoutingModule {}
