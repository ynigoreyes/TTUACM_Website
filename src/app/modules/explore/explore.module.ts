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
import { EditModalComponent } from './pages/profile/components/edit-modal/edit-modal.component';
import { MatDialog, MatDialogModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { PreviewModalComponent } from './pages/profile/components/preview-modal/preview-modal.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ExploreRoutingModule,
    AngularFireStorageModule,
    MaterialModule,
    MatDialogModule
  ],
  declarations: [
    FeedComponent,
    ProjectsComponent,
    ComingSoonComponent,
    ProfileComponent,
    EditModalComponent,
    PreviewModalComponent
  ],
  providers: [ProfileService, MatDialog],
  entryComponents: [EditModalComponent, PreviewModalComponent]
})
export class ExploreModule {}
