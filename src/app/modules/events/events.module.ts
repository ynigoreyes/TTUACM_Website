import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsRoutingModule } from './events-routing.module';
import { CalendarComponent } from './page/calendar/calendar.component';
import { MaterialModule } from '../../shared/material.module';
import { EventsService } from './services/events.service';
import { EventCardsComponent } from './page/calendar/components/event-cards/event-cards.component';

@NgModule({
  imports: [
    CommonModule,
    EventsRoutingModule,
    MaterialModule
  ],
  declarations: [CalendarComponent, EventCardsComponent],
  providers: [EventsService]
})
export class EventsModule { }
