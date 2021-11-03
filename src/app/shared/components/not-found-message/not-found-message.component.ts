import {Component, ChangeDetectionStrategy, Input} from '@angular/core';

@Component({
  selector: 'l-not-found-message',
  templateUrl: './not-found-message.component.html',
  styleUrls: ['./not-found-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundMessageComponent {
  @Input() message: string;
}
