import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { TeamComponent } from './pages/team/team.component';
import { LandingComponent } from './landing.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { MaterialModule } from '../../shared/material.module';

@NgModule({
  imports: [CommonModule, LandingRoutingModule, MaterialModule],
  declarations: [
    HomeComponent,
    TeamComponent,
    LandingComponent,
    NavbarComponent,
    CarouselComponent,
    FooterComponent
  ]
})
export class LandingModule {}
