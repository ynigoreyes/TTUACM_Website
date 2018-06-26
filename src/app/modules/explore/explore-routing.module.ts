import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FeedComponent } from './pages/feed/feed.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AuthGuard } from '@acm-shared/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: FeedComponent,
  },
  {
    path: 'projects',
    component: ProjectsComponent
  },
  {
    // {{host}}/explore/user
    path: 'user',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExploreRoutingModule { }
