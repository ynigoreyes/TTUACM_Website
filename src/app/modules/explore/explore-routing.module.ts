import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FeedComponent } from './pages/feed/feed.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ProfileComponent } from './pages/profile/profile.component';

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
    path: 'user',
    component: ProfileComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExploreRoutingModule { }
