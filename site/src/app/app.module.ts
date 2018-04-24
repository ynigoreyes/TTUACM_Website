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
import { ForgotComponent } from './components/forgot/forgot.component';
import { HomeComponent } from './components/home/home.component';
import { ErrorComponent } from './components/error/error.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ResetComponent } from './components/reset/reset.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { ContactModalComponent } from './components/contact-modal/contact-modal.component';

import { FlashMessagesModule, FlashMessagesService } from 'angular2-flash-messages';
import { ContactService } from './services/contact.service';
import { AuthService } from './services/auth.service';
import { UserSidebarComponent } from './components/profile/user-sidebar/user-sidebar.component';
import { FeedComponent } from './components/profile/feed/feed.component';
import { AuthGuard } from './guards/auth.guard';
import { ProfileUploadModalComponent } from './components/profile/user-sidebar/profile-upload-modal/profile-upload-modal.component';
import { EventsService } from './services/events.service';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'team', component: TeamComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'events', component: EventsComponent },
  { path: 'forgot', component: ForgotComponent },
  { path: 'error', component: ErrorComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'reset', component: ResetComponent },
  // Fallback Route
  { path: '**', redirectTo: '/'}
];

@NgModule({
  declarations: [
    AppComponent,
    TeamComponent,
    SignupComponent,
    EventsComponent,
    ForgotComponent,
    HomeComponent,
    ErrorComponent,
    LoginComponent,
    ProfileComponent,
    ResetComponent,
    FooterComponent,
    NavbarComponent,
    CarouselComponent,
    ContactModalComponent,
    UserSidebarComponent,
    FeedComponent,
    ProfileUploadModalComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    FlashMessagesModule,
    MaterialModule
  ],
  entryComponents: [
    ContactModalComponent,
    ProfileUploadModalComponent
  ],
  providers: [
    FlashMessagesService,
    HttpClientModule,
    ContactService,
    AuthService,
    AuthGuard,
    EventsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
