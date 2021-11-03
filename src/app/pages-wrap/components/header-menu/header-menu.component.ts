import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'l-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderMenuComponent {

  @Input()
  isOpenMenu: boolean;

  @Input()
  widthScreen: number;

  @Input()
  isInHeader = false;

  @Output()
  showOrHideMenu = new EventEmitter<boolean>();

  constructor(
  ) {
  }

}
