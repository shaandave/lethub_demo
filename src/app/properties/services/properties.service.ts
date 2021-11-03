import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PropertiesService {



  public propertiesData = [];

  static isRequiredPropertyName(data) {
    if (!data.propertyName) {
      return {
        leaseTerm: data.leaseTerm,
        numberUnits: data.numberUnits,
        parking: data.parking,
        petFriendly: data.petFriendly,
        address: data.address,
        type: data.type,
        utilities: data.utilities,
        amenities: data.amenities,
        noSmoking: data.noSmoking,

      };
    } else {
      return data;
    }
  }

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
  }

  public getProperties(offset, limit = 8): Observable<any> {
    return this.http.get(`${environment.privateUrl}/property/list/?offset=${offset}&limit=${limit}`);
  }

  public getProperty(id): Observable<any> {
    return this.http.get(`${environment.privateUrl}/property/show`, {
      params: {
        id
      }
    }).pipe(
      map(data => data['property']),
      catchError(() => this.router.navigate(['/properties']))
    );
  }

  public searchProperties(offset, query) {
    return this.http.get(`${environment.privateUrl}/property/search?q=${query}&offset=${offset}&limit=${8}`);
}

  public getPropertyImage(id) {
    return this.http.get(`${environment.publicUrl}/file/show`, {
      params: {
        entityName: 'property',
        entityId: id
      }
    }).pipe(
      map(
        data => data['file']
      )
    );
  }

  
}
