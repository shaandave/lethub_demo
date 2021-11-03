import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacebookSyncPopupComponent } from './components/facebook-sync-popup/facebook-sync-popup.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core'
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatPseudoCheckboxModule } from '@angular/material/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA, MatDialogActions
} from '@angular/material/dialog';
import { NgxSpinnerModule } from "ngx-spinner";
import { NgbTimepickerModule } from "@ng-bootstrap/ng-bootstrap";
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { NgxMaskModule } from 'ngx-mask';
import { CKEditorModule } from '../../assets/ckeditor';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MatInputModule,
    MatDialogModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    MatDatepickerModule,
    MatStepperModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatPseudoCheckboxModule,
    MatRadioModule,
    MatIconModule,
    SharedModule,
    RouterModule,
    MatTableModule,
    NgxMaskModule,
    NgbTimepickerModule,
    MatRadioModule,
    NgxSpinnerModule,
    MatSlideToggleModule,
    CKEditorModule,
    FormsModule,
    MatDatepickerModule,
  ],
  declarations: [
    FacebookSyncPopupComponent
  ],
  entryComponents: [
    FacebookSyncPopupComponent
  ],
  providers: [
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: {} }

  ]
})
export class PopupsModule {
}


