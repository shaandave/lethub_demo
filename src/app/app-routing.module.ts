import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components';

// import { AuthRoutingModule } from "./auth/auth-routing.module";
// import { LoginContainerComponent } from './auth/containers/login-container';
import { HomeRoutingModule } from './home/home-routing.module';
import { DetailRoutingModule } from './detail/detail-routing.module';
import { SyndicationRoutingModule } from './syndication/syndication-routing.module';
import { AuthGuard } from './auth/services/auth.guard';
import { PagesWrapModule } from './pages-wrap/pages-wrap.module';

import { MatTableModule } from '@angular/material/table'
import { SharedModule } from './shared/shared.module';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { PopupsModule } from './popups/popups.module';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full',
  },
  {
    path: 'login',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'home',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  // {
  //   path: 'syndication',
  //   redirectTo: 'syndication',
  //   pathMatch: 'full',
  // },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
    HomeRoutingModule,
    DetailRoutingModule,
    MatTableModule,
    SharedModule,
    MatSelectModule,
    MatFormFieldModule,
    MatOptionModule,
    // AuthRoutingModule,
    // SyndicationRoutingModule
  ],
  exports: [RouterModule],
  // providers: [AuthGuard],
})
export class AppRoutingModule { }
