import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MessagingRoutingModule } from './messaging-routing.module';
import { MessagingComponent } from './messaging.component';
import { ContactComponent } from './pages/contact/contact.component';
import { MaterialModule } from '../../shared/material.module';
import { ContactFormComponent } from './components/contact-form/contact-form.component';

import { ContactService } from './services/contact.service';
import { UserStateService } from '../../shared/services/user-state.service';

@NgModule({
  imports: [CommonModule, MessagingRoutingModule, FormsModule, ReactiveFormsModule, MaterialModule],
  declarations: [MessagingComponent, ContactComponent, ContactFormComponent],
  providers: [UserStateService, ContactService]
})
export class MessagingModule {}
