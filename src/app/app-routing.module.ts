import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: './modules/landing/landing.module#LandingModule',
    pathMatch: 'full'
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
    path: 'messaging',
    loadChildren: './modules/messaging/messaging.module#MessagingModule'
  },
  {
    path: 'explore',
    loadChildren: './modules/explore/explore.module#ExploreModule'
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
