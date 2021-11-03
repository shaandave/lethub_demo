import { Component, OnInit, Inject, ChangeDetectionStrategy, ChangeDetectorRef, Input, EventEmitter, OnChanges, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { SyndicationService } from '../../../syndication/services/syndication.service';



@Component({
  selector: 'l-facebook-sync-popup',
  templateUrl: './facebook-sync-popup.component.html',
  styleUrls: ['./facebook-sync-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FacebookSyncPopupComponent implements OnInit, OnChanges {
  @Input() syncHours: any;
  @Output() saveSuccess = new EventEmitter<any>();
  syncIntervals = [
    { "id": "once", "desc": "only once" },
    { "id": "12h", "desc": "every 12 hours" },
    { "id": "24h", "desc": "every 24 hours" },
    { "id": "7d", "desc": "every 7 days" },
  ]

  public syncForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<FacebookSyncPopupComponent>,
    private cdr: ChangeDetectorRef,
    public syndicationService: SyndicationService,
    private fb: FormBuilder,
  ) {
    this.syncForm = this.fb.group({
      syncHours: [null, Validators.required]
    })
  }

  ngOnInit(): void {
    // this.syndicationService.getSyncInterval().subscribe(result => {
    //   this.syncHours = result.syncInterval;
    // })
    // // this.syncHours = this.data.syncHours;
    // this.cdr.detectChanges();
  }

  ngOnChanges(): void {

  }

  public confirm() {
    this.dialogRef.close({
      syncHours: this.syncHours,
    });
  }

  public cancel() {
    this.dialogRef.close();
  }

  public setSyncInterval(id) {
    this.syncHours = id;
    this.cdr.detectChanges();
  }
}
