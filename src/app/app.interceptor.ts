import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse, HttpHeaderResponse, HttpSentEvent, HttpProgressEvent, HttpResponse, HttpUserEvent,
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, finalize, take } from 'rxjs/operators';
// import {TrialExpiredPopupComponent} from './popups/components/trial-expired-popup/trial-expired-popup.component';
import { MatDialog } from '@angular/material/dialog';
// import {HavePlanService} from './shared/services/have-plan.service';
import { AuthenticationService } from './auth/services/authentication.service';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { Router } from '@angular/router';
// import {TrialExpiredMemberComponent} from './popups/components/trial-expired-member/trial-expired-member.component';
import { SnackBarService } from './shared/services/snack-bar.service';
import { ElectronService } from './core/services/electron/electron.service';

@Injectable()
export class InterceptorService implements HttpInterceptor {

  private firstShowBilling = true;
  private isRefreshingToken = false;
  private tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(
    private authService: AuthenticationService,
    private dialog: MatDialog,
    // private havePlanService: HavePlanService,
    private router: Router,
    private snackBarService: SnackBarService,
    private electronService: ElectronService,
  ) {
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any> | any> {
    if (request.url.includes('private')) {
      return next.handle(this.addTokenToRequest(request, localStorage.getItem('token')))
        .pipe(
          catchError(err => {
            if (err instanceof HttpErrorResponse) {
              switch ((<HttpErrorResponse>err).status) {
                case 401:
                  if (request.url.includes('login')) {
                    this.snackBarService.openSnackBar({
                      title: 'Login or password is not correct',
                      type: 'error',
                      time: 5000,
                    });
                    console.log('incorrect email pass');
                  } else {
                    return this.handle401Error(request, next);
                  }
                  return throwError(err);
                case 400:
                  if (request.url.includes('refresh')) {
                    return this.authService.logout(localStorage.getItem('refreshToken'));
                  }
                  if (request.url.includes('register')) {
                    return next.handle(request);
                  } else if (!localStorage.getItem('refreshToken')) {
                    this.router.navigate(['/login']);
                  }
                  return throwError(err);
                case 403:
                  const role = localStorage.getItem('role');

                  if (role) {
                    if (role === 'Member') {

                      if (err.error.type === 'max-units') {
                        // this.dialog.open(TrialExpiredMemberComponent, {
                        //   disableClose: false,
                        //   width: '270px',
                        //   data: { title: err.error.title, description: err.error.description }
                        // });
                      } else {
                        return next.handle(request);
                      }

                    } else if (role === 'Owner') {
                      if (err.error.type === 'max-units') {
                        // this.dialog.open(TrialExpiredPopupComponent, {
                        //   disableClose: false,
                        //   width: '270px',
                        //   data: { title: err.error.title, description: err.error.description }
                        // });
                      } else {

                      }
                    }
                  } else {
                    this.router.navigate(['/login']);
                  }
                  return throwError(err);

                case 429:
                  this.snackBarService.openSnackBar({
                    title: 'You are sending too many requests. Wait a few minutes, please!',
                    type: 'error',
                    time: 5000,
                  });
                  console.log('too many reqs');
                  return throwError(err);

                default:
                  return throwError(err);
              }
            } else {
              return throwError(err);
            }
          })
        );
    } 
    else {
      return next.handle(request);
    }
  }

  private addTokenToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;
      this.tokenSubject.next(null);
      return this.authService.refreshToken()
        .pipe(
          switchMap((data) => {
            if (data) {
              localStorage.setItem('token', data.token);
              localStorage.setItem('refreshToken', data.refreshToken);
              this.electronService.send("tokenRefreshed", { token: data.token, refreshToken: data.refreshToken });
              this.tokenSubject.next(data.token);
              return next.handle(this.addTokenToRequest(request, data.token));
            }
            return <any>this.authService.logout(localStorage.getItem('refreshToken'));
          }),
          catchError(() => {
            return <any>this.authService.logout(localStorage.getItem('refreshToken'));
          }),
          finalize(() => {
            this.isRefreshingToken = false;
          })
        );
    } else {
      return this.tokenSubject
        .pipe(filter(token => token != null),
          take(1),
          switchMap(token => {
            return next.handle(this.addTokenToRequest(request, token));
          }));
    }
  }
}
