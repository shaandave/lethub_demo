import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { mainMenu } from './menu.config';
import { IMenu } from '../../../shared/interfaces/menu.interface';

@Component({
  selector: 'l-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent {

  public mainMenu: Array<IMenu> = mainMenu;
  public permissionSettings: any;
  constructor() {
    if (localStorage.getItem('permissionSettings')) {
      this.permissionSettings = JSON.parse(localStorage.getItem('permissionSettings'));

    }
  }
  @Input()
  isOpenMenu: boolean;

  @Input()
  widthScreen: number;

  @Output()
  showOrHideMenu = new EventEmitter<boolean>();

  public clickLink() {
    if (this.widthScreen < 992) {
      this.showOrHideMenu.emit();
    }
  }
  public isHideMenu(module) {
    let item = module.name;
    switch (item) {
      case 'Properties': {
        if (!this.permissionSettings || !this.permissionSettings.Property || (this.permissionSettings.Property.canView)) {
          return true;
        }
        else
          return false;
      }
      // case 'Dashboard': {
      //   if (!this.permissionSettings || !this.permissionSettings.Dashboard || (this.permissionSettings.Dashboard.canView)) {
      //     return true;
      //   }
      //   else
      //     return false;
      // }
      case 'Syndication': {
        if (!this.permissionSettings || !this.permissionSettings.OnMarketsOnly || (this.permissionSettings.OnMarketsOnly.canView)) {
          return true;
        }
        else
          return false;
      }
      case 'Leads': {
        if (!this.permissionSettings || !this.permissionSettings.Lead || (this.permissionSettings.Lead.canView)) {
          return true;
        }
        else
          return false;
      }
      // case 'Reports': {
      //   if (!this.permissionSettings || !this.permissionSettings.Reports || (this.permissionSettings.Reports.canView)) {
      //     return true;
      //   }
      //   else
      //     return false;
      // }
      // case 'Calendar': {
      //   if (!this.permissionSettings || !this.permissionSettings.Calendar || (this.permissionSettings.Calendar.canView)) {
      //     return true;
      //   }
      //   else
      //     return false;
      // }
      // case 'Settings': {
      //   if (!this.permissionSettings || !this.permissionSettings.Settings || (this.permissionSettings.Settings.canView)) {
      //     return true;
      //   }
      //   else
      //     return false;
      // }
      default: {
        //statements; 
        return true;
      }
    }
  }

}
