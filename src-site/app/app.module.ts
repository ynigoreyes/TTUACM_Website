import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { MatDialogModule, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from './material.module';

import { AppComponent } from './app.component';
import { TeamComponent } from './components/team/team.component';
import { SignupComponent } from './components/signup/signup.component';
import { EventsComponent } from './components/events/events.component';
import { HomeComponent } from './components/home/home.component';
import { ErrorComponent } from './components/error/error.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ResetComponent } from './components/reset/reset.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';

import { ContactService } from './services/contact.service';
import { AuthService } from './services/auth.service';
import { FeedComponent } from './components/profile/feed/feed.component';
import { AuthGuard } from './guards/auth.guard';
import { EventsService } from './services/events.service';
import { Oauth2Service } from './services/oauth2.service';
import { AuthMethodsComponent } from './components/_includes/auth-methods/auth-methods.component';
import { ContactComponent } from './components/contact/contact.component';
import { RedirectComponent } from './components/forgot/redirect/redirect.component';
import { PromptComponent } from './components/forgot/prompt/prompt.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'team', component: TeamComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'events', component: EventsComponent },
  { path: 'prompt', component: PromptComponent },
  { path: 'prompt/:tokenError', component: PromptComponent },
  // Delete this path bellow soon, this is just so i can see the design
  { path: 'redirect', component: RedirectComponent },
  { path: 'redirect/:token', component: RedirectComponent },
  { path: 'reset', component: RedirectComponent, canActivate: [AuthGuard] },
  { path: 'error', component: ErrorComponent },
  { path: 'login', component: LoginComponent },
  { path: 'contact-us', component: ContactComponent },
  { path: 'dashboard', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'confirmation', component: ConfirmationComponent},
  // Fallback Route
  { path: '**', redirectTo: '/'}
];

@NgModule({
  declarations: [
    AppComponent,
    TeamComponent,
    SignupComponent,
    EventsComponent,
    HomeComponent,
    ErrorComponent,
    LoginComponent,
    ProfileComponent,
    ResetComponent,
    FooterComponent,
    NavbarComponent,
    CarouselComponent,
    FeedComponent,
    ConfirmationComponent,
    AuthMethodsComponent,
    ContactComponent,
    RedirectComponent,
    PromptComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    MaterialModule
  ],
  providers: [
    HttpClientModule,
    ContactService,
    AuthService,
    AuthGuard,
    EventsService,
    Oauth2Service
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
