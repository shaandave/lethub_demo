import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
// import { SettingsPageComponent } from './components/settings-page/settings-page.component';
// import { SettingsCompanyContainerComponent } from './containers/settings-company-container/settings-company-container.component';
// import { AccountInfoComponent } from './components/account-info/account-info.component';
// import { SettingsBillingComponent } from './components/settings-billing/settings-billing.component';
// import { SettingsGeneralContainerComponent } from './containers/settings-general-container/settings-general-container.component';
// import { SettingsBillingContainerComponent } from './containers/settings-billing-container/settings-billing-container.component';
// import { SettingsUsersContainerComponent } from './containers/settings-users-container/settings-users-container.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRadioModule } from '@angular/material/radio';


// import { SettingsService } from './services/settings.service';
import { SharedModule } from '../shared/shared.module';
// import { ChangePasswordComponent } from './components/change-password/change-password.component';
// import { MemberFormComponent } from './components/member-form/member-form.component';
// import { TeamTableComponent } from './components/team-table/team-table.component';
// import { SettingsUsersService } from './services/settings-users.service';
// import { BillingTableComponent } from './components/billing-table/billing-table.component';
// import { BillingInvoiceComponent } from './components/billing-invoice/billing-invoice.component';
// import { BillingService } from './services/billing.service';
// import { PopupsModule } from '../popups/popups.module';
// import { BillingPricePipe } from './pipes/billing-price.pipe';
import { NgxMaskModule } from 'ngx-mask';
// import { SettingsCardWrapperComponent } from './components/settings-card-wrapper/settings-card-wrapper.component';
// import { ChatbotCardComponent } from './components/chatbot-card/chatbot-card.component';
// import { PhoneCardComponent } from './components/phone-card/phone-card.component';
// import { ImportPropertiesCardComponent } from './components/import-properties-card/import-properties-card.component';
// import { EmailCardComponent } from './components/email-card/email-card.component';
// import { PrequalCardComponent } from './components/prequal-card/prequal-card.component';
// import { AvailabilityCardComponent } from './components/availability-card/availability-card.component';
// import { RentalApplicationCardComponent } from './components/rental-application-card/rental-application-card.component';
// import { NotificationsCardComponent } from './components/notifications-card/notifications-card.component';
// import { BillingFeaturesComponent } from './components/billing-features/billing-features.component';
import { CKEditorModule } from '../../assets/ckeditor';
import { NgbTimepickerModule } from "@ng-bootstrap/ng-bootstrap";
import { ProgressBarModule } from "angular-progress-bar"
// import { ApplicationProcessCardComponent } from './components/application-process-card/application-process-card.component';

@NgModule({
    imports: [
        CommonModule,
        SettingsRoutingModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        ReactiveFormsModule,
        SharedModule,
        MatTabsModule,
        ReactiveFormsModule,
        MatTableModule,
        MatPaginatorModule,
        MatRadioModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        MatMenuModule,
        MatIconModule,
        MatTooltipModule,
        MatDialogModule,
        MatSlideToggleModule,
        MatSortModule,
        MatSelectModule,
        // PopupsModule,
        NgxMaskModule,
        NgbTimepickerModule,
        FormsModule,
        ProgressBarModule,
        CKEditorModule
    ],
    declarations: [
        // SettingsPageComponent,
        // AccountInfoComponent,
        // SettingsCompanyContainerComponent,
        // SettingsBillingComponent,
        // SettingsGeneralContainerComponent,
        // SettingsBillingContainerComponent,
        // SettingsUsersContainerComponent,
        // ChangePasswordComponent,
        // MemberFormComponent,
        // TeamTableComponent,
        // BillingTableComponent,
        // BillingInvoiceComponent,
        // BillingPricePipe,
        // SettingsCardWrapperComponent,
        // ChatbotCardComponent,
        // PhoneCardComponent,
        // ImportPropertiesCardComponent,
        // EmailCardComponent,
        // PrequalCardComponent,
        // AvailabilityCardComponent,
        // RentalApplicationCardComponent,
        // NotificationsCardComponent,
        // BillingFeaturesComponent,
        // ApplicationProcessCardComponent
    ],
    providers: [
        // SettingsService,
        // SettingsUsersService,
        // BillingService,

    ],
    exports: [
        // PrequalCardComponent,
        // AvailabilityCardComponent,
    ]
})
export class SettingsModule {
}
