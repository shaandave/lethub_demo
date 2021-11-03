import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'l-table-preloader',
  templateUrl: './table-preloader.component.html',
  styleUrls: ['./table-preloader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TablePreloaderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
