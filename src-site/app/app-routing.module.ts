import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: './modules/landing/landing.module#LandingModule'
  },
  {
    path: 'auth',
    loadChildren: './modules/user-auth/user-auth.module#UserAuthModule'
  },
  {
    path: 'events',
    loadChildren: './modules/events/events.module#EventsModule'
  },
  {
    path: 'contact-us',
    loadChildren: './modules/events/events.module#EventsModule'
  },
  {
    path: 'error',
    loadChildren: './modules/errors/errors.module#ErrorsModule'
  },
  // Fallback Route
  {
    path: '**',
    redirectTo: '/error'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
