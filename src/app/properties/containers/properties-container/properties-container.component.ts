import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PropertiesService } from '../../services/properties.service';
import { IProperty } from '../../interfaces/property.interface';
import { DOCUMENT } from '@angular/common';
// import { ISubscription } from "rxjs/Subscription";
import { MatMenuTrigger } from "@angular/material/menu";
import { MatDialog} from '@angular/material/dialog'
import { Router } from '@angular/router';
// import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
// import { TrialExpiredPopupComponent } from '../../../popups/components/trial-expired-popup/trial-expired-popup.component';
import { NgxSpinnerService } from "ngx-spinner"; 


@Component({
  selector: 'l-properties-container',
  templateUrl: './properties-container.component.html',
  styleUrls: ['./properties-container.component.scss']
})
export class PropertiesContainerComponent implements OnInit {

  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;


  scroll = (): void => {
    if (this.trigger) {
      this.trigger.closeMenu();
      window.removeEventListener('scroll', this.scroll)
    }
  };

  addEventForCloseByScroll = () => {
    window.addEventListener('scroll', this.scroll)
  };

  public propertiesList: IProperty;
  public offset = 0;
  public isEndPropertyList = false;
  public isFirstRequestGetProperties = true;
  public searchQuery: string;
  public exportFetching = false;
  public permissionSettings: any;
  constructor(
    private SpinnerService: NgxSpinnerService,
    private propertiesService: PropertiesService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    if (localStorage.getItem('permissionSettings')) {
      let permissionSettings = JSON.parse(localStorage.getItem('permissionSettings'));
      this.permissionSettings = permissionSettings.Property;
    }
    this.propertiesService.propertiesData = undefined;
    this.getProperties(this.offset);

    window.onscroll = () => {
      if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 100)) {
        if (!this.isEndPropertyList && this.propertiesList.countProperties > 0) {
          this.showMore();
        }
      }
    }
  }

  private getProperties(offset) {
    this.isEndPropertyList = false;
    if (this.searchQuery) {
      this.propertiesService.searchProperties(offset, this.searchQuery).subscribe(
        (data: IProperty) => {
          this.checkedGetProperties(data);
        }
      );
    } else {
      this.propertiesService.getProperties(offset).subscribe(
        (data: IProperty) => {

          this.checkedGetProperties(data);
        }
      );
    }
  }
  //Filters duplicate properties caused by scrolling
  private filterDuplicateProperties() {
    this.propertiesList.properties = Array.from(new Set(this.propertiesList.properties.map(property => property.id)))
      .map(id => {
        return this.propertiesList.properties.find(property => property.id === id)
      })
  }
  private checkedGetProperties(data) {

    if (this.isFirstRequestGetProperties) {
      this.propertiesList = data;
      this.filterDuplicateProperties();
      this.isFirstRequestGetProperties = false;
    } else {
      // data.properties.map(
      // 	property => {
      // 		this.propertiesList.properties.push(property);
      // 	}
      // );
      data.properties.forEach(property => {
        this.propertiesList.properties.push(property);
      });
      this.filterDuplicateProperties();
    }
    if (this.propertiesList.countProperties === this.propertiesList.properties.length) {
      this.isEndPropertyList = true;
    }
    this.getPropertyImage(data.properties);
    this.cdr.detectChanges();
  }

  public getPropertyImage(properties) {
    properties.map(
      property => {
        this.propertiesService.getPropertyImage(property.id).subscribe(
          (image) => {
            property.image = image;
            this.cdr.detectChanges();
          }
        );
      }
    );
  }

  public showMore() {
    this.offset += 8;
    this.getProperties(this.offset);
    this.cdr.detectChanges();
  }

  public doSearch(searchQuery) {
    this.offset = 0;
    this.searchQuery = searchQuery;
    this.isFirstRequestGetProperties = true;
    this.getProperties(this.offset);
  }
  public saveVendor(val) {
    this.SpinnerService.show();
    //	localStorage.setItem('changestatus','0');
    if (val) {

      debugger;
      localStorage.setItem('changestatus', '0');
      this.propertiesList.properties = [];

      this.getProperties(0);
      this.SpinnerService.hide();
    }
  }
}
