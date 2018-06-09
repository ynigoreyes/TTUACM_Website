import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExploreRoutingModule } from './explore-routing.module';
import { FeedComponent } from './pages/feed/feed.component';
import { ExploreComponent } from './explore.component';
import { FeaturedComponent } from './pages/featured/featured.component';

@NgModule({
  imports: [
    CommonModule,
    ExploreRoutingModule
  ],
  declarations: [FeedComponent, ExploreComponent, FeaturedComponent]
})
export class ExploreModule { }
