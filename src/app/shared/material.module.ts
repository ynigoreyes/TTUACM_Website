import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { LayoutModule } from '@angular/cdk/layout';
import {
  MatSidenavModule,
  MatButtonModule,
  MatInputModule,
  MatSelectModule,
  MatFormFieldModule,
  MatCardModule,
  MatMenuModule,
  MatToolbarModule,
  MatTabsModule,
  MatIconModule,
  MatSnackBarModule,
  MatRadioModule,
  MatProgressSpinnerModule,
  MatCheckboxModule,
  MatGridListModule
} from '@angular/material';

@NgModule({
  imports: [
    MatSidenavModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatCardModule,
    MatRadioModule,
    MatMenuModule,
    MatToolbarModule,
    MatTabsModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    LayoutModule
  ],
  exports: [
    MatSidenavModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatRadioModule,
    MatCardModule,
    MatMenuModule,
    MatToolbarModule,
    MatTabsModule,
    MatIconModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    LayoutModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class MaterialModule {}
