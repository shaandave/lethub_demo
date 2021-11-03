import { Component, OnInit, EventEmitter, Input, Output, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatMenuTrigger } from '@angular/material/menu';
import { IUnitData, IUnitsTable } from '../../interfaces/units-table.interface';
import { environment } from '../../../../environments/environment'
import { SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";
import { SnackBarService } from '../../../shared/services/snack-bar.service';
import { ElectronService } from '../../../core/services/electron/electron.service';
import { SyndicationService } from '../../services/syndication.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FacebookSyncPopupComponent } from '../../../popups/components/facebook-sync-popup/facebook-sync-popup.component';
import { of, Subscription, timer } from 'rxjs';
import { catchError, elementAt, filter, switchMap } from 'rxjs/operators';
import { SyncingProgressBarComponent } from '../../../shared/components/syncing-progress-bar/syncing-progress-bar.component';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'l-units-vacant',
  templateUrl: './units-vacant.component.html',
  styleUrls: ['./units-vacant.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UnitsVacantComponent implements OnInit {

  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  @Input() unitList: IUnitsTable;

  @Output() pagination = new EventEmitter();

  public fbSignedIn: Boolean;
  public fbSyncDisabled = false;
  public FB: any;
  user: SocialUser;
  loggedIn: boolean;
  public sync = true;
  public syncIntervalTitle: string;
  public syncHours: any;
  public basicURL = environment.baseUrlFrontend;
  public pageSizeOptions: number[] = [5, 10, 20, 50, 100, 200, 500];
  public selection = new SelectionModel<IUnitData>(true, []);
  public displayedColumns: string[] = [
    'select',
    'unit',
    'propertyAddress',
    'status',
    'showingAgent',
  ];
  private facebookDialog: MatDialogRef<FacebookSyncPopupComponent, any>;
  private progressBar: MatDialogRef<SyncingProgressBarComponent, any>;
  public syncedUnits: IUnitData[] = [];
  public syncedUnitsIds: number[] = [];
  public flaggedUnits: number[] = [];
  subscription: Subscription;
  syncStatus: any;
  public syncToggle = true;
  public syncToggleDisabled = false;

  constructor(
    // private fbAuthService: SocialAuthService,
    private snackBarService: SnackBarService,
    private electronService: ElectronService,
    private syndicationService: SyndicationService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {
    this.fbSignedIn = false;
    this.fbSyncDisabled = false;
  }

  ngOnInit(): void {
    this.setSyncSettings();
    this.checkFBConnection();
    this.checkIfSyncing();
    this.cdr.detectChanges();
  }

  selectSyncedUnits() {
    if (this.syncedUnitsIds !== undefined && this.syncedUnitsIds !== null) {
      this.unitList.units.forEach(element => {
        if(this.syncedUnitsIds.includes(element.id)) {
          this.syncedUnits.push(element);
        }
      });
    }
    console.log("syncedUnits", this.syncedUnits);
    console.log("unitList", this.unitList.units);
    this.selection = new SelectionModel<IUnitData>(true, this.syncedUnits);
    this.cdr.detectChanges();
  }

  // getSyncStatus(): any {
  //   this.electronService.on("syncStatus", (event, args) => {
  //     if (args === true) this.syncStatus = true;
  //     else this.syncStatus = false;
  //   });
  // }

  checkIfSyncing(): any {
    // this.electronService.send("checkIfSyncing", "");
    // console.log('hello do i exist');

    this.electronService.on("checkIfSyncingReply", (event, args) => {
      console.log("ifsync", args);
      if (args === true) {
        this.syncStatus = true;
        this.fbSyncDisabled = true;
        this.cdr.detectChanges();
      }
      else {
        this.syncStatus = false;
        this.fbSyncDisabled = false;
        this.cdr.detectChanges();
      }
    });
  }

  //set sync interval title 
  setSyncSettings() {
    this.syndicationService.getSyncSettings().subscribe(result => {
      this.syncedUnitsIds = result['syncedUnits'];
      this.selectSyncedUnits();
      this.flaggedUnits = result['flaggedUnits'];
      this.syncHours = result['syncInterval'];
      this.syncToggle = result['sync'];
      if (this.syncToggle === true) {
        switch (this.syncHours) {
          case "once": {
            this.syncIntervalTitle = "Synced once";
            break;
          }
          case "12h": {
            this.syncIntervalTitle = "Syncing every 12 hours";
            break;
          }
          case "24h": {
            this.syncIntervalTitle = "Syncing every 24 hours";
            break;
          }
          case "7d": {
            this.syncIntervalTitle = "Syncing every 7 days";
            break;
          }
          default: {
            this.syncIntervalTitle = "Currently not syncing";
            break;
          }
        }
        this.syncToggleDisabled = false;
      }
      else {
        this.syncIntervalTitle = "Sync disabled";
        this.syncToggleDisabled = true;
      }
      this.cdr.detectChanges();
    })
  }

  //sign out
  signOut(): void {
    if (this.fbSignedIn === true) {
      this.electronService.send('logoutOfFacebook', "");
      this.electronService.on('logoutOfFacebookReply', (event, args) => {
        if (args === 'success') {
          this.snackBarService.openSnackBar({
            title: `Signed out of Facebook`,
            type: 'success',
            time: 5000
          });
        } else {
          //error
          this.snackBarService.openSnackBar({
            title: `Error signing Out of Facebook`,
            type: 'error',
            time: 5000
          });
        }

      })

    } else {
      this.snackBarService.openSnackBar({
        title: 'Not signed in',
        type: 'error',
        time: 5000
      });
    }
    this.fbSignedIn = false;
    this.cdr.detectChanges();
  }

  //check if user is signed in on facebook
  public checkFBConnection() {
    this.electronService.send('isFBSignedIn', "");
    this.electronService.on('isFBSignedInReply', (event, args) => {
      if (args === "success") {
        this.fbSignedIn = true;
        this.syncToggleDisabled = false;
        this.cdr.detectChanges();
      } else {
        this.fbSignedIn = false;
        this.syncToggleDisabled = true;
        this.cdr.detectChanges();
      }
    });
    this.cdr.detectChanges();
  }

  //facebook sign in
  public async signInFB() {
    this.electronService.send('loginToFacebook', "");
    this.electronService.on('loginToFacebookReply', (event, args) => {
      if (args === "success") {
        this.fbSignedIn = true;
        this.snackBarService.openSnackBar({
          title: `Signed in to Facebook`,
          type: 'success',
          time: 5000
        });
        this.cdr.detectChanges();
      }
    });
    this.cdr.detectChanges();
  }

  //syncs units to facebook
  public syncToFB() {
    if (this.getSelectedUnits().length === 0) {
      this.snackBarService.openSnackBar({
        title: 'Please select the units you want to sync to Facebook',
        type: 'error',
        time: 5000
      });
    } else {
      if (this.fbSignedIn) {
        this.facebookDialog = this.dialog.open(FacebookSyncPopupComponent, {
          width: '400px',
          disableClose: true,
          height: '250px',
          minWidth: '10%',
        });

        this.facebookDialog.afterClosed().subscribe(result => {
          if (result) {
            this.snackBarService.openSnackBar({
              title: 'Starting sync to Facebook',
              type: 'success',
              time: 5000
            });

            var data = {
              syncedUnits: this.getSelectedUnitsIds(),
              sync: true,
              syncInterval: result.syncHours,
            }

            this.electronService.send('facebook', this.getSelectedUnitsIds());
            this.progressBar = this.dialog.open(SyncingProgressBarComponent, {
              width: '400px',
              height: '200px',
              minWidth: '10%',
              data: data,
            });

            this.progressBar.afterClosed().subscribe(result => {
              // this.router.navigate([this.router.url]);
              // this.router.navigate(["/"]);
            })
          }
        })

      } else {
        this.snackBarService.openSnackBar({
          title: 'Not signed in',
          type: 'error',
          time: 5000
        });
      }
    }
    this.cdr.detectChanges();
  }

  scroll = (): void => {
    if (this.trigger) {
      this.trigger.closeMenu();
      window.removeEventListener('scroll', this.scroll)
    }
  };

  addEventForCloseByScroll = () => {
    window.addEventListener('scroll', this.scroll)
  };

  public isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.unitList.units.length;
    return numSelected === numRows;
  };

  public masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.unitList.units.forEach(row => this.selection.select(row));
  }

  public changePage(e) {
    this.pagination.emit(e);
    this.selection.clear();
  }

  public getSelectedUnits() {
    return this.selection.selected;
  }

  public getSelectedUnitsIds() {
    var ids = this.getSelectedUnits().map(unit => {
      return unit.id;
    })
    return ids;
  }

  public onToggleChange() {
    if (this.syncToggle === true) {
      console.log("changing from false to true");
    }
    else {
      console.log("changing from true to false");
      console.log("popup are you sure you want to disable sync");
      this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        width: '450px',
        data: 'Are you sure you want to disable sync to Facebook?'
      }).afterClosed().subscribe((res) => {
        console.log("res", res);

        if (res === true) {
          this.syndicationService.postSyncSettings({
            sync: false,
          }).subscribe(() => {
            this.syncToggle = false;
            // this.router.navigate(['/main/syndication']);
            // this.router.navigate(["/"]);
          });
        } else {
          this.syncToggle = true;
          this.cdr.detectChanges();
        }
      });
    }
  }
}
