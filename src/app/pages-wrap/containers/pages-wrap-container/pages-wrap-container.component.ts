import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  HostListener,
} from '@angular/core';
import { PagesWrapService } from '../../services/pages-wrap.service';
import { IUser } from '../../interfaces/user.interface';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { IImage } from '../../../properties/interfaces/property.interface';
import { AuthenticationService } from '../../../auth/services/authentication.service';
// import { StepByStepService } from '../../../step-by-step/services/step-by-step.service';
import { Location } from '@angular/common';
import { ElectronService } from '../../../core/services';
@Component({
  selector: 'l-pages-container',
  templateUrl: './pages-wrap-container.component.html',
  styleUrls: ['./pages-wrap-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PagesWrapContainerComponent implements OnInit {

  public isOpenMenu = localStorage.getItem('isOpenMenu') !== null ? localStorage.getItem('isOpenMenu') !== 'false' : true;
  public $user: Observable<IUser>;
  public $avatar: Observable<IImage>;
  public widthScreen = window.innerWidth;
  public showOnBoarding: boolean;

  constructor(
    private router: Router,
    private pagesWrapService: PagesWrapService,
    private authService: AuthenticationService,
    private electronService: ElectronService,
    // private stepByStepService: StepByStepService,
    private _router: Router, location: Location
  ) {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      this.authService.refreshTokenBE();
    }
    // _router.events.subscribe((val) => {
    //   if (location.path() != '') {
    //     if (location.path() == '/account-setup') {
    //       this.isOpenMenu = false;
    //     }
    //   }
    // });
  }

  ngOnInit(): void {
    this.$user = this.pagesWrapService.getUser();
    this.$user.subscribe(
      user => {
        if (user) {
          this.showOnBoarding = user.role === 'Owner';
          // this.$avatar = this.pagesWrapService.getAvatar(user.id);
        }
      }
    );

    // this.pagesWrapService.isUserAvatarUpdate.subscribe((
    //   userId) => {
    //   this.$avatar = this.pagesWrapService.getAvatar(userId);
    // }
    // );
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
