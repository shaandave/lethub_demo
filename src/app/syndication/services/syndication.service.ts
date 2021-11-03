import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SyndicationService {

  constructor(
    private http: HttpClient,

  ) { }

  getSyncSettings() {
    return this.http.get(`${environment.privateUrl}/facebook/getSyncSettings`);
  }

  postSyncSettings(data: any): Observable<any> {
    console.log(data);
    if (data.syncInterval === 'once') {
      return this.http.post(`${environment.privateUrl}/facebook/updateSyncSettings`, {
        sync: false,
        syncedUnits: data.syncedUnits,
        syncInterval: data.syncInterval,
        flaggedUnits: data.flaggedUnits
      });
    }
    return this.http.post(`${environment.privateUrl}/facebook/updateSyncSettings`, {
      sync: data.sync,
      syncedUnits: data.syncedUnits,
      syncInterval: data.syncInterval,
      flaggedUnits: data.flaggedUnits
    });
  }

  public searchVacantUnits(q, limit, offset): Observable<any> {
    return this.http.get(`${environment.privateUrl}/unit/vacant-search?q=${q}&limit=${limit}&offset=${offset * limit}`);
  };

  public searchVacantOrSyncedUnits(q, limit, offset): Observable<any> {
    return this.http.get(`${environment.privateUrl}/facebook/vacant-or-synced-search?q=${q}&limit=${limit}&offset=${offset * limit}`);
  };

  public getUnitsVacant(page, limit): Observable<any> {
    return this.http.get(`${environment.privateUrl}/unit/vacant-list?offset=${page * limit}&limit=${limit}`);
  };

  public getVacantOrSyncedUnits(page, limit): Observable<any> {
    return this.http.get(`${environment.privateUrl}/facebook/vacant-or-synced-list?offset=${page * limit}&limit=${limit}`);
  }
}
