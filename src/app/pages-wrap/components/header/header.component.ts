import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter, ViewChild, ChangeDetectorRef
} from '@angular/core';
import { IUser } from '../../interfaces/user.interface';
import { IImage } from '../../../properties/interfaces/property.interface';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
const remote = require('electron').remote;
@Component({
  selector: 'l-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  @Input()
  isOpenMenu: boolean;

  @Input()
  widthScreen: number;

  @Input()
  user: IUser;

  @Input()
  avatar: IImage;

  @Output()
  showOrHideMenu = new EventEmitter<boolean>();
  showError = false;

  private refreshToken = localStorage.getItem('refreshToken');
  userId = "";
  notDashboard = false;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    if (localStorage.getItem("userId") != undefined && localStorage.getItem("userId") != null) {
      this.userId = localStorage.getItem("userId");
    }

    setInterval(function () {
      if (router.url == "/") {
        this.notDashboard = false;
      } else {
        this.notDashboard = true;
      }

      if (localStorage.getItem("hideError" + this.userId) != null && localStorage.getItem("hideError" + this.userId) != undefined) {

        this.showError = (localStorage.getItem("hideError" + this.userId) == "1") ? true : false;
        this.cdr.detectChanges();
      }

    }.bind(this), 500);
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

  openMenu = () => {
    if (this.trigger) {
      this.trigger.openMenu()
    }
  }



  public logout() {
    this.authService.logout(this.refreshToken);
    // this.router.navigate([""]);
    let w = remote.getCurrentWindow();
    w.close();
  }
}
