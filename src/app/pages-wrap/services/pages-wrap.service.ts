import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, Subject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { IUser } from '../interfaces/user.interface';
import { IImage } from '../../properties/interfaces/property.interface';
import { AuthenticationService } from '../../auth/services/authentication.service';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class PagesWrapService {


  public isUserAvatarUpdate = new Subject();
  public isCompanyUpdate = new Subject();

  constructor(
    private http: HttpClient,
    private route: Router,
    private authService: AuthenticationService,

  ) {
   
  }

  public getUser(): Observable<IUser> {
    return this.http.get(`${environment.privateUrl}/auth/user`).pipe(
      map(
        data => {
          localStorage.setItem('role', data['user'].role);
          localStorage.setItem('isLandlordOrPm', data['user']['userLandlordOrPM']);
          return data['user'];
        }
      )
    );
  }
  
  public getUserById(id): Observable<any> {
    let dataToSend = { 'id': id };
    return this.http.post(`${environment.publicUrl}/user/get-user-by-id`, { ...dataToSend }).pipe(
      map(
        result => {
          return result["user"];
        }
      ),
      catchError(
        error => {
          return throwError(error);
        }
      )
    );
  }

  // public getAvatar(id): Observable<IImage> {
  //   return this.http.get(`${environment.publicUrl}/file/show?entityName=user&e <div *ngIf="!notDashboard && showError" class="header__content">
  //       <i style="margin-left:1%;margin-right:1%;">
  //         <img alt="Disabled" src="../../../../assets/images/triangle.svg"></i> 
         
  //       Set up incomplete 😱. To get the most out of LetHub please complete the steps below</div>
  //   ntityId=${id}`).pipe(
  //     map(
  //       data => data['file']
  //     )
  //   );
  // }

  public getProperty(url): Observable<any> {
    let dataToSend = { 'url': url };
    return this.http.post(`${environment.publicUrl}/property/get-by-url`, { ...dataToSend }).pipe(
      map(
        result => {
          return result;
        }
      ),
      catchError(
        error => {
          return throwError(error);
        }
      )
    );
  }
  public saveMessageToRiver(dataToSend): Observable<any> {
    return this.http.post(`${environment.publicUrl}/riverlogs/update-river-logs`, { ...dataToSend }).pipe(
      map(
        result => {
          return result;
        }
      ),
      catchError(
        error => {
          return throwError(error);
        }
      )
    );

  }
  public getUserPropertyByURL(url, id): Observable<any> {
    let dataToSend = { 'url': url, 'id': id };
    return this.http.post(`${environment.publicUrl}/property/get-userproperty-by-url`, { ...dataToSend }).pipe(
      map(
        result => {
          return result;
        }
      ),
      catchError(
        error => {
          return throwError(error);
        }
      )
    );
  }

  checkDashboardProperties(): Observable<any> {
    return this.http.get<any>(`${environment.privateUrl}/dashboard/checkDashboardProperties`);
  }
}
