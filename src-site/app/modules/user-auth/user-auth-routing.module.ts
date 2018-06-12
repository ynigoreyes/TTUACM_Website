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
    component: AuthComponent,
  },
  {
    path: 'forgot',
    component: ForgotComponent
  },
  {
    path: 'forgot',
    children: [
      {
        path: 'redirect',
        component: ForgotRedirectComponent
      },
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
