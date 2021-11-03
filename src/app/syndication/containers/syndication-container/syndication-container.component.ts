import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { SyndicationService } from '../../services/syndication.service';
import { Observable } from 'rxjs';
// import {UnitDetailComponent} from '../../../popups/components/unit-detail/unit-detail.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'l-syndication-container',
  templateUrl: './syndication-container.component.html',
  styleUrls: ['./syndication-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SyndicationContainerComponent implements OnInit {
  public unitList;
  private searchQuery: string;
  private paginator;

  constructor(
    private syndicationService: SyndicationService,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    this.getUnitsVacant();
  }

  public getUnitsVacant(paginator?) {
    if (paginator) {
      this.paginator = paginator;
    }

    if (this.paginator) {
      if (this.searchQuery) {
        this.unitList = this.syndicationService.searchVacantOrSyncedUnits(
          this.searchQuery,
          this.paginator.pageSize,
          this.paginator.pageIndex).subscribe((data) => {
            this.unitList = data;
            this.cdr.detectChanges();
          });
      } else {
        this.unitList = this.syndicationService.getVacantOrSyncedUnits(
          this.paginator.pageIndex,
          this.paginator.pageSize
        ).subscribe((data) => {
          this.unitList = data;
          this.cdr.detectChanges();
        });
      }
    } else {
      if (this.searchQuery) {
        this.syndicationService.searchVacantOrSyncedUnits(this.searchQuery, 20, 0).subscribe((data) => {
          this.unitList = data;
          this.cdr.detectChanges();
        });;

      } else {
        this.syndicationService.getVacantOrSyncedUnits(
          0,
          20
        ).subscribe((data) => {
          this.unitList = data;
          this.cdr.detectChanges();
        });
      }
    }
  }

  public searchUnits(query) {
    this.searchQuery = query;
    this.getUnitsVacant();
  }
}
