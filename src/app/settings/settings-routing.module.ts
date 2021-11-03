import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import {SettingsPageComponent} from './components/settings-page/settings-page.component';
// import {SettingsGeneralContainerComponent} from "./containers/settings-general-container/settings-general-container.component";
// import {SettingsUsersContainerComponent} from "./containers/settings-users-container/settings-users-container.component";
// import {SettingsCompanyContainerComponent} from "./containers/settings-company-container/settings-company-container.component";
// import {SettingsBillingContainerComponent} from "./containers/settings-billing-container/settings-billing-container.component";
// import { ConfirmDeactivateGuard } from '../shared/services/confirm-deactivate-guard-for-settings.service';



const routes: Routes = [
    //   {
    //     path: '',
    //     component: SettingsPageComponent, canDeactivate: [ConfirmDeactivateGuard]
    //     },
    //     {
    //         path: '/:selectedIndex',
    //         component: SettingsPageComponent, canDeactivate: [ConfirmDeactivateGuard]
    //     },
    // {
    //   path: 'general',
    //   component: SettingsGeneralContainerComponent
    // },
    // {
    //   path: 'company',
    //   component: SettingsCompanyContainerComponent
    // },
    // {
    //   path: 'users',
    //   component: SettingsUsersContainerComponent
    // },
    // {
    //   path: 'billing',
    //   component: SettingsBillingContainerComponent
    // }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SettingsRoutingModule {
}
