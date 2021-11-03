import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  OnInit,
} from "@angular/core";
import { ILoginData } from "../../interfaces/login.interface";
const { ipcRenderer } = require('electron');

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
const notification = document.getElementById('notification');

@Component({
  selector: "l-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent  implements OnInit {
  //   public publicUrl = environment.publicUrl;
  public isShowPassword = false;
  public rememberMe = true;
  public loginForm: FormGroup;
  @Output() loginSuccess = new EventEmitter<ILoginData>();

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: [
        null,
        Validators.compose([
          Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/),
          Validators.required,
        ]),
      ],
      password: [
        null,
        Validators.compose([
          Validators.pattern(/^[\S]{8,20}$/),
          Validators.required,
        ]),
      ],
      rememberMe: [],
    });
  }
  ngOnInit(): void {
    const version = document.getElementById('version');
    
    ipcRenderer.send('app_version');
    ipcRenderer.on('app_version', (event, arg) => {
      ipcRenderer.removeAllListeners('app_version');
      version.innerText = 'Version ' + arg.version;
    });
    const message = document.getElementById('message');
    const restartButton = document.getElementById('restart-button');
    ipcRenderer.on('update_available', () => {
      console.log("update_available");
    ipcRenderer.removeAllListeners('update_available');
    message.innerText = 'A new update is available. Downloading now...';
    //notification.classList.remove('hidden');
    document.getElementById('notification').classList.remove('hidden');
    });
    ipcRenderer.on('update_downloaded', () => {
      console.log("update_downloaded");
    ipcRenderer.removeAllListeners('update_downloaded');
    message.innerText = 'Update Downloaded. It will be installed on restart. Restart now?';
    //restartButton.classList.remove('hidden');
    document.getElementById('restart-button').classList.remove('hidden');
    //notification.classList.remove('hidden');
    document.getElementById('notification').classList.remove('hidden');
    });
  }
  public closeNotification() {
      //notification.classList.add('hidden');
      console.log("closeNotification");
      document.getElementById('notification').classList.add('hidden');
  }
  public restartApp() {
    console.log("restart_app");
        ipcRenderer.send('restart_app');
  }

  public login() {
    if (this.loginForm.valid) {
      // if (this.loginForm.controls["rememberMe"].value === true) {
      //   localStorage.setItem("remember", "true");
      // } else {
      //   localStorage.setItem("remember", "false");
      // }
      localStorage.setItem("remember", "true");
      this.loginSuccess.emit(this.loginForm.value);
    }
  }
}
