import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorsRoutingModule } from './errors-routing.module';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ErrorsComponent } from './errors.component';

@NgModule({
  imports: [
    CommonModule,
    ErrorsRoutingModule
  ],
  declarations: [NotFoundComponent, ErrorsComponent]
})
export class ErrorsModule { }
