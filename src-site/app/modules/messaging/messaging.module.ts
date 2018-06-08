import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessagingRoutingModule } from './messaging-routing.module';
import { MessagingComponent } from './messaging.component';
import { ContactComponent } from './pages/contact/contact.component';
import { MaterialModule } from '../../shared/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MessagingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  declarations: [MessagingComponent, ContactComponent]
})
export class MessagingModule { }
