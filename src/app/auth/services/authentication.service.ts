import { Injectable } from '@angular/core';
import { Observable, throwError } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { ITokens } from "../interfaces/login.interface";
import { catchError, map, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

import { SnackBarService } from '../../shared/services/snack-bar.service';
import { ElectronService } from "../../core/services/electron/electron.service";
import { electron } from 'process';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(

    private http: HttpClient,
    private snackBarService: SnackBarService,
    private electronService: ElectronService,
    private router: Router,

  ) {
  }

  //clears local storage
  public tokenStorageClear() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');
    localStorage.removeItem('remember');
    localStorage.removeItem("hideError" + localStorage.getItem('userId'));
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('redirectToLead');
    localStorage.removeItem('isPublicPage');
    localStorage.removeItem('permissionSettings');
    localStorage.removeItem('calendarAccount');
  }

  //logs in and updates local storage with user data
  public login(data): Observable<ITokens | any> {
    let rememberMe = 1;

    var res;
    res = this.http.post(`${environment.baseUrl}/public/login`, {
      email: data.email,
      password: data.password,
      rememberme: rememberMe,
    });
    return res.pipe(
      map((result: ITokens) => {
        this.tokenStorageClear();
        localStorage.setItem('token', result.token);
        localStorage.setItem('refreshToken', result.refreshToken);
        localStorage.setItem('userEmail', data.email);
        console.log(result.userId, "userId");
        localStorage.setItem('userId', result.userId);
        localStorage.setItem('username', result.username)
        localStorage.setItem('redirectToLead', result.redirectToLead.toString());
        // console.log('isPublicPage', result.isPublicPage.toString())
        localStorage.setItem('isPublicPage', result.isPublicPage.toString());
        localStorage.setItem('permissionSettings', result.permissionSettings);
        sessionStorage.setItem('activeSession', 'true');
        this.electronService.send('login', {
          token: result.token,
          refreshToken: result.refreshToken,
          userId: result.userId,
        });
        return result;
      }),
      catchError(
        error => {
          this.snackBarService.openSnackBar({
            title: error.msg,
            type: 'error',
            time: 5000,
          });
          return throwError(error);
        })
    );
    return res;
  }

  //checks if token is present aka user logged in
  public isLoggedIn(): Boolean {
    if (localStorage.getItem('token')) return true;
    else return false;
  }

  //refreshes the token
  public refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');
    console.log("refreshing token");

    return this.http.post(`${environment.publicUrl}/refresh`, {
      refreshToken: refreshToken,
    });

    // console.log("token refreshed");

  }

  //catch tokens from BE on refresh
  public refreshTokenBE() {
    this.electronService.on("refreshTokenBE", (event, args) => {
      if (args) {
        console.log(args["token"]);
        console.log(args['refreshToken']);
        localStorage.setItem("token", args["token"]);
        localStorage.setItem("refreshToken", args["refreshToken"]);
      }
    })
  }


  //clears the local storage and logs out
  public logout(refresh) {
    if (refresh) {
      location.reload();
    }
    this.tokenStorageClear();

    this.electronService.send("logout");
    return this.http.post(`${environment.baseUrl}/public/logout`, {
      refreshToken: refresh,
    });
    // this.router.navigate(["/login"]);
  }
}
