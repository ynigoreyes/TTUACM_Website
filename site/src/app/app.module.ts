import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';


import { AppComponent } from './app.component';
import { TeamComponent } from './components/team/team.component';
import { SignupComponent } from './components/signup/signup.component';
import { ContactComponent } from './components/contact/contact.component';
import { EventsComponent } from './components/events/events.component';
import { ForgotComponent } from './components/forgot/forgot.component';
import { HomeComponent } from './components/home/home.component';
import { ErrorComponent } from './components/error/error.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ResetComponent } from './components/reset/reset.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';

import { FlashMessagesModule, FlashMessagesService } from 'angular2-flash-messages';
import { CarouselComponent } from './components/carousel/carousel.component';
const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'team', component: TeamComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'events', component: EventsComponent },
  { path: 'forgot', component: ForgotComponent },
  { path: 'error', component: ErrorComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'reset', component: ResetComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    TeamComponent,
    SignupComponent,
    ContactComponent,
    EventsComponent,
    ForgotComponent,
    HomeComponent,
    ErrorComponent,
    LoginComponent,
    ProfileComponent,
    ResetComponent,
    FooterComponent,
    NavbarComponent,
    CarouselComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    FlashMessagesModule,
  ],
  providers: [
    FlashMessagesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
