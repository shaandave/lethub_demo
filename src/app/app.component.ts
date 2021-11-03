import { Component, HostListener, OnInit } from "@angular/core";
import { ElectronService } from "./core/services";
import { TranslateService } from "@ngx-translate/core";
import { APP_CONFIG, environment } from "../environments/environment";
import { AuthenticationService } from "./auth/services/authentication.service";
import { Router } from "@angular/router";
import { PagesWrapService } from "./pages-wrap/services/pages-wrap.service";
import { Observable } from "rxjs";
import { IUser } from "./pages-wrap/interfaces/user.interface";
import { IImage } from "./properties/interfaces/property.interface";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  isPublicPage = false;


  public isOpenMenu = localStorage.getItem('isOpenMenu') !== null ? localStorage.getItem('isOpenMenu') !== 'false' : true;
  public $user: Observable<IUser>;
  public $avatar: Observable<IImage>;
  public widthScreen = window.innerWidth;
  public showOnBoarding: boolean;


  constructor(
    private electronService: ElectronService,
    private translate: TranslateService,
    private router: Router,
    private pagesWrapService: PagesWrapService,
    private authService: AuthenticationService,
  ) {

    //Turn off logs in prod
    if (environment.production) {
      //enableProdMode();
      if (window) {
        window.console.log = function() {};
      }
    }

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);

    }
    this.translate.setDefaultLang("en");
    console.log("APP_CONFIG", APP_CONFIG);
    // console.log("environment", environment);
    // console.log("local", localStorage);
    // console.log("session", sessionStorage);

    // if (electronService.isElectron) {
    //   console.log(process.env);
    //   console.log("Run in electron");
    //   console.log("Electron ipcRenderer", this.electronService.ipcRenderer);
    //   console.log("NodeJS childProcess", this.electronService.childProcess);
    // } else {
    //   console.log("Run in browser");
    // }
  }

  ngOnInit() {
    
    var url = document.URL.split('#')[1];
    if (url === null || url === undefined) {
      this.isPublicPage = false;
    } else if (url.split('/')[1] !== 'company') {
      this.isPublicPage = false;
    } else {
      this.isPublicPage = true;
    }

    if (localStorage.getItem('remember') === 'false') {
      if (sessionStorage.getItem('activeSession') !== 'true' && !this.isPublicPage) {
        localStorage.setItem('token', '');
        localStorage.setItem('tokenRefresh', '');
      }
    }
  }

  public loggedIn() {
    return localStorage.getItem('token');
  }

  public showOrHideMenu() {
    this.isOpenMenu = !this.isOpenMenu;
    localStorage.setItem('isOpenMenu', String(this.isOpenMenu));
  }

  @HostListener('window:resize', ['$event.currentTarget'])
  resize(e) {
    this.widthScreen = e.innerWidth;
  }

  public onSwipeLeft() {
    if ('ontouchstart' in window) {
      this.isOpenMenu = false;
    }
  }

  public onSwipeRight() {
    if ('ontouchstart' in window) {
      this.isOpenMenu = true;
    }
  }

  // public subRefreshLinks() {
  //   this.stepByStepService.dashboardRefreshLinks.next();
  // }

  // public subRefreshStatistics() {
  //   this.stepByStepService.dashboardRefreshStatistics.next();
  // }


}
