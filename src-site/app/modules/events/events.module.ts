import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsRoutingModule } from './events-routing.module';
import { CalendarComponent } from './page/calendar/calendar.component';
import { EventsComponent } from './events.component';
import { MaterialModule } from '../../shared/material.module';

@NgModule({
  imports: [
    CommonModule,
    EventsRoutingModule,
    MaterialModule
  ],
  declarations: [CalendarComponent, EventsComponent]
})
export class EventsModule { }
