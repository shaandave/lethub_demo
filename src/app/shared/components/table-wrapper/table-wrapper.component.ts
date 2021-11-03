import {Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core';

@Component({
  selector: 'l-table-wrapper',
  templateUrl: './table-wrapper.component.html',
  styleUrls: ['./table-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableWrapperComponent implements OnInit {

  @Input() public noMargin = false;

  constructor() {
  }

  ngOnInit() {
  }

}
