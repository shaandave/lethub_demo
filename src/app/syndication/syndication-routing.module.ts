import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { PagesWrapContainerComponent } from './containers/pages-wrap-container/pages-wrap-container.component';
import { PropertiesContainerComponent } from '../properties/containers/properties-container/properties-container.component';
import { SyndicationContainerComponent } from '../syndication/containers/syndication-container/syndication-container.component';

const routes: Routes = [
    {
        path: 'syndication',
        component: SyndicationContainerComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SyndicationRoutingModule { }