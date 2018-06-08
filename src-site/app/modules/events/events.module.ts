import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsRoutingModule } from './events-routing.module';
import { CalendarComponent } from './page/calendar/calendar.component';
import { EventsComponent } from './events.component';

@NgModule({
  imports: [
    CommonModule,
    EventsRoutingModule
  ],
  declarations: [CalendarComponent, EventsComponent]
})
export class EventsModule { }
