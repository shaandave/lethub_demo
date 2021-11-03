import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PropertyContainerComponent } from './containers/property-container/property-container.component';
import { PropertiesContainerComponent } from './containers/properties-container/properties-container.component';
import { ImportPropertiesContainerComponent } from './containers/import-properties-container/import-properties-container.component';
// import { ConfirmDeactivateGuard } from '../shared/services/confirm-deactivate-guard-for-settings.service';

const routes: Routes = [
  {
    path: 'properties',
    component: PropertiesContainerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PropertiesRoutingModule {
}
