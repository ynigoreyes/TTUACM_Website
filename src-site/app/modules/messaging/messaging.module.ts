import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessagingRoutingModule } from './messaging-routing.module';
import { MessagingComponent } from './messaging.component';
import { ContactComponent } from './pages/contact/contact.component';
import { MaterialModule } from '../../shared/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UserStateService } from '../../shared/services/user-state.service';

@NgModule({
  imports: [CommonModule, MessagingRoutingModule, FormsModule, ReactiveFormsModule, MaterialModule],
  declarations: [MessagingComponent, ContactComponent],
  providers: [UserStateService]
})
export class MessagingModule {}
