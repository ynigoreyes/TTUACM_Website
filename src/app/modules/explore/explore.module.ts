import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireStorageModule } from 'angularfire2/storage';

import { ExploreRoutingModule } from './explore-routing.module';
import { FeedComponent } from './pages/feed/feed.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ComingSoonComponent } from '../../components/coming-soon/coming-soon.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { MaterialModule } from '@acm-shared/material.module';
import { ProfileService } from './services/profile.service';

@NgModule({
  imports: [CommonModule, ExploreRoutingModule, AngularFireStorageModule, MaterialModule],
  declarations: [FeedComponent, ProjectsComponent, ComingSoonComponent, ProfileComponent],
  providers: [ProfileService]
})
export class ExploreModule {}
