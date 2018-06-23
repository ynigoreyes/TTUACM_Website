import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExploreRoutingModule } from './explore-routing.module';
import { FeedComponent } from './pages/feed/feed.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ComingSoonComponent } from '../../components/coming-soon/coming-soon.component';
import { ProfileComponent } from './pages/profile/profile.component';


@NgModule({
  imports: [
    CommonModule,
    ExploreRoutingModule
  ],
  declarations: [FeedComponent, ProjectsComponent, ComingSoonComponent, ProfileComponent]
})
export class ExploreModule { }
