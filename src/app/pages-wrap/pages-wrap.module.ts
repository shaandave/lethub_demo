import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesWrapRoutingModule } from './pages-wrap-routing.module';
import { PagesWrapContainerComponent } from './containers/pages-wrap-container/pages-wrap-container.component';
// import { DashboardService } from '../dashboard/services/dashboard.service';
import { HeaderComponent } from './components/header/header.component';
import { MenuComponent } from './components/menu/menu.component';
import { MatMenuModule } from '@angular/material/menu';
import { HeaderMenuComponent } from './components/header-menu/header-menu.component';
// import { StepByStepModule } from '../step-by-step/step-by-step.module';
import { SharedModule } from '../shared/shared.module';
import { AuthGuard } from '../auth/services/auth.guard';
import { MatRadioModule } from '@angular/material/radio';
// import { BillingService } from '../settings/services/billing.service';
// import { PopupsModule } from '../popups/popups.module';

@NgModule({
    imports: [
        CommonModule,
        PagesWrapRoutingModule,
        MatMenuModule,
        // StepByStepModule,
        SharedModule,
        // PopupsModule,
        // AuthGuard,
        MatRadioModule
    ],
    declarations: [
        PagesWrapContainerComponent,
        HeaderComponent,
        MenuComponent,
        HeaderMenuComponent,
    ],
    providers: [
        // DashboardService,
        // AuthGuard,
    ],
})
export class PagesWrapModule {
}

