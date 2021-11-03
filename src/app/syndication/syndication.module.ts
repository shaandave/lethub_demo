import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SyndicationContainerComponent } from './containers/syndication-container/syndication-container.component';
import { UnitsVacantComponent } from './components/units-vacant/units-vacant.component';
import { UnitsTableComponent } from './components/units-table/units-table.component';
import { SharedModule } from '../shared/shared.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';



@NgModule({
  declarations: [
    SyndicationContainerComponent,
    UnitsVacantComponent,
    UnitsTableComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatCheckboxModule,
    MatMenuModule,
    MatButtonModule,
    MatDialogModule,
    MatSlideToggleModule
  ]
})
export class SyndicationModule { }
