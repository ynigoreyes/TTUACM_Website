import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './shared/material.module';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from 'angularfire2';

import { AppComponent } from './app.component';
import { AuthService } from './modules/user-auth/services/auth.service';
import { UserStateService } from './shared/services/user-state.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { environment } from '@acm-environments/environment';

@NgModule({
  declarations: [AppComponent, NavbarComponent, FooterComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    HttpClientModule,
    AppRoutingModule,
    MaterialModule
  ],
  providers: [HttpClientModule, AuthService, UserStateService, AuthGuard],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class AppModule {}
