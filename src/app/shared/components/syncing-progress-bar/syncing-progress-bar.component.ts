import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Inject, Output, Input } from '@angular/core';
import { SnackBarService } from '../../services/snack-bar.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SyndicationService } from '../../../syndication/services/syndication.service';
import { ElectronService } from '../../../core/services/electron/electron.service';

@Component({
  selector: 'l-syncing-progress-bar',
  templateUrl: './syncing-progress-bar.component.html',
  styleUrls: ['./syncing-progress-bar.component.scss']
})
export class SyncingProgressBarComponent implements OnInit {
  public isSyncing = true;
  public success = false;
  progressValue = 0;
  syncStatus = 'Syncing';

  constructor(
    private syndicationService: SyndicationService,
    private snkBar: SnackBarService,
    private cdr: ChangeDetectorRef,
    private dlg: MatDialogRef<SyncingProgressBarComponent>,
    private electronService: ElectronService,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) {
    // console.log(this.progressValue);
    this.progressValue = 0;
    // this.getProgress();
    // this.cdr.detectChanges();
  }

  ngOnInit() {
    this.getProgress();
    this.isSyncing = true;
    // console.log("data", this.data);
  }

  getProgress() {
    // setTimeout(() => {
    //   this.progressValue = 20;
    // }, 2000);
    // setTimeout(() => {
    //   this.progressValue = 40;
    // }, 4000);
    // setTimeout(() => {
    //   this.progressValue = 60;
    // }, 6000);
    // setTimeout(() => {
    //   this.progressValue = 80;
    // }, 8000);
    // setTimeout(() => {
    //   this.progressValue = 100;
    // }, 10000);

    this.electronService.on('syncStatus', (event, args) => {
      console.log("TEST",args);
      switch (args) {
        case "start":
          this.progressValue = 0;
          this.syncStatus = "Sync to Facebook started. Grab a coffee while we’re at it!"
          this.syndicationService.postSyncSettings(this.data).subscribe();
          break;

        case "downloadPictures":
          this.progressValue = 20;
          this.syncStatus = "Downloading unit pictures from LetHub...";
          break;

        case "scrapeFB":
          this.progressValue = 40;
          this.syncStatus = "Getting unit information from Facebook...";
          break;

        case "syncUnitInfo":
          this.progressValue = 60;
          this.syncStatus = "Syncing unit infomation to Facebook from LetHub...";
          break;

        case "pushToFB":
          this.progressValue = 80;
          this.syncStatus = "Pushing units to Facebook...";
          break;

        case "completed":
          this.progressValue = 100;
          this.syncStatus = "Push to Facebook complete";
          this.isSyncing = false;
          //this.syndicationService.postSyncSettings(this.data).subscribe();
          break;

        case "error":
          this.progressValue = 0;
          this.syncStatus = "Error occured while syncing"
          this.isSyncing = false;
          break;

        default:
          this.progressValue = 0;
          this.syncStatus = "Error occured while syncing"
          this.isSyncing = false;
          break;
      }
      this.cdr.detectChanges();
    });

    this.cdr.detectChanges();
  }

  close() {
    this.dlg.close();
  }
}
