import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginContainerComponent } from './containers/login-container/login-container.component';
import { LoginComponent } from './components/login/login.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { SignInUpWrapperComponent } from './components/sign-in-up-wrapper/sign-in-up-wrapper.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		AuthRoutingModule,
		MatButtonModule,
		MatInputModule,
		MatFormFieldModule,
		MatCheckboxModule,
		ReactiveFormsModule,
		SharedModule,
	],
	declarations: [
		LoginContainerComponent,
		LoginComponent,
		SignInUpWrapperComponent
	],
})
export class AuthModule {
}
