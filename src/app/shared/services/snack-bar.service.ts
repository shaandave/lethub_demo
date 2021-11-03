import { Injectable } from '@angular/core';
import { NoticeComponent } from '../components/notice/notice.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ISnackBarData } from '../interfaces/snack-bar.interface';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor(
    public snackBar: MatSnackBar
  ) { }

  public openSnackBar(data: ISnackBarData) {
    this.snackBar.openFromComponent(NoticeComponent, {
      duration: data.time || 2000,
      verticalPosition: 'top',
      horizontalPosition: 'end',
      panelClass: 'snack-custom',
      data: data,
    });
  }
}
