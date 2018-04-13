import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatInputModule,
  MatSelectModule,
  MatFormFieldModule,
  MatCardModule
} from '@angular/material';

@NgModule({
  imports: [
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCardModule
  ],
  exports: [
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCardModule
  ]
})
export class MaterialModule {}
