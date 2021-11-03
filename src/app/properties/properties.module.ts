import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertiesComponent } from './components/properties/properties.component';
import { PropertiesImportComponent } from './components/properties-import/properties-import.component';
import { PropertiesContainerComponent } from './containers/properties-container/properties-container.component';
import { PropertyContainerComponent } from './containers/property-container/property-container.component';
import { ImportPropertiesContainerComponent } from './containers/import-properties-container/import-properties-container.component';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    PropertiesComponent,
    PropertiesImportComponent,
    PropertiesContainerComponent,
    PropertyContainerComponent,
    ImportPropertiesContainerComponent
  ],
  imports: [
    CommonModule,
    MatMenuModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    NgxSpinnerModule,
    SharedModule
  ]
})
export class PropertiesModule { }
