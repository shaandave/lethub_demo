import {Component, ChangeDetectionStrategy, Output, EventEmitter, Input} from '@angular/core';

@Component({
  selector: 'l-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent {
  @Input() countSymbol: number;
  @Input() isCustomStyle: false;
  @Input() customStyle: string;
  @Input() customPlaceholder: string;

  @Output() search = new EventEmitter();

  public isSearch = false;

  public doSearch(inputSearch) {
    this.isSearch = true;
    this.search.emit(inputSearch.value);
  }
}
