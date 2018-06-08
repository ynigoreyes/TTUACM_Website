import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { TeamComponent } from './pages/team/team.component';
import { LandingComponent } from './landing.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { MaterialModule } from '../../shared/material.module';

@NgModule({
  imports: [CommonModule, LandingRoutingModule, MaterialModule],
  declarations: [
    HomeComponent,
    TeamComponent,
    LandingComponent,
    CarouselComponent,
  ]
})
export class LandingModule {}
