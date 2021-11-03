import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { SearchComponent } from './components/search/search.component';
import { NotFoundMessageComponent } from './components/not-found-message/not-found-message.component';
import { TablePreloaderComponent } from './components/table-preloader/table-preloader.component';
import { TableWrapperComponent } from './components/table-wrapper/table-wrapper.component';
import { WebviewDirective } from './directives/';
import { FormsModule } from '@angular/forms';
import { NoticeComponent } from './components/notice/notice.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackBarService } from './services/snack-bar.service';
import { SyncingProgressBarComponent } from './components/syncing-progress-bar/syncing-progress-bar.component';
import { ProgressBarModule } from 'angular-progress-bar';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';

@NgModule({
  declarations: [
    PageNotFoundComponent,
    SearchComponent,
    WebviewDirective,
    TableWrapperComponent,
    NotFoundMessageComponent,
    TablePreloaderComponent,
    NoticeComponent,
    SyncingProgressBarComponent,
    ConfirmationDialogComponent,
  ],

  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    MatSnackBarModule,
    ProgressBarModule,
  ],

  exports: [
    TranslateModule,
    WebviewDirective,
    FormsModule,
    SearchComponent,
    TableWrapperComponent,
    NotFoundMessageComponent,
    TablePreloaderComponent,
  ],

  providers: [
    SnackBarService,
  ]

})
export class SharedModule { }
