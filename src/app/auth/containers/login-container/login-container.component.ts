import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "../../services/authentication.service";
// import { SettingsService } from "../../../settings/services/settings.service";

@Component({
  selector: "l-login-container",
  templateUrl: "./login-container.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginContainerComponent {
  userId = "";
  constructor(
    private router: Router,
    private authService: AuthenticationService,
    // private settingService: SettingsService,
    private activatedRoute: ActivatedRoute
  ) {
    this.userId = "";
  }

  public login(data) {
    this.authService.login(data).subscribe((response) => {
      // console.log(response);
      if (typeof response !== "undefined") {
        this.router.navigate(['/']);
      }
    });
  }
}
