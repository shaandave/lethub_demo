import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service'

@Component({
  selector: 'l-sign-in-up-wrapper',
  templateUrl: './sign-in-up-wrapper.component.html',
  styleUrls: ['./sign-in-up-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignInUpWrapperComponent implements OnInit {

  constructor(
    private router: Router,
    // public authenticationService: AuthenticationService,
  ) { }

  ngOnInit() {
    if (localStorage.getItem('token') && localStorage.getItem('refreshToken')) {
      this.router.navigate(['/']);
    }
  }
}
