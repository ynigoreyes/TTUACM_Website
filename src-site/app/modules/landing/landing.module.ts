import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { TeamComponent } from './pages/team/team.component';
import { LandingComponent } from './landing.component';

@NgModule({
  imports: [CommonModule, LandingRoutingModule],
  declarations: [HomeComponent, TeamComponent, LandingComponent]
})
export class LandingModule {}
