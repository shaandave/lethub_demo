import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";

import { LoginContainerComponent } from "./containers/login-container/login-container.component";
import { SignInUpWrapperComponent } from "./components/sign-in-up-wrapper/sign-in-up-wrapper.component";

const routes: Routes = [
  {
    path: 'login',
    component: SignInUpWrapperComponent,
    children: [
      {
        path: "",
        component: LoginContainerComponent,
      },
      {
        path: ':id',
        component: LoginContainerComponent
      },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule { }
