import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessagingRoutingModule } from './messaging-routing.module';
import { MessagingComponent } from './messaging.component';

@NgModule({
  imports: [
    CommonModule,
    MessagingRoutingModule
  ],
  declarations: [MessagingComponent]
})
export class MessagingModule { }
