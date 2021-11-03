import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { SnackBarService } from '../../shared/services/snack-bar.service';

export class SettingsService {
  constructor(
    private http: HttpClient,
    private snackBarService: SnackBarService,
  ) {
    // console.log('settigns', environment);
  }

  public getCompany(): Observable<any> {
    return this.http.get(`${environment.privateUrl}/company/show`).pipe(
      map(data => data['company'])
    );
  }
}
