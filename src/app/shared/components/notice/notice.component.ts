import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { ISnackBarData } from '../../interfaces/snack-bar.interface';

@Component({
  selector: 'l-notice',
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoticeComponent {

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: ISnackBarData,
  ) { }
}
