import { Routes } from '@angular/router';

import { AskForPasswordResetComponent } from './ask-for-password-reset/ask-for-password-reset.component';
import { ConfirmAccountComponent } from './confirm-account/confirm-account.component';
import { GeneratePasswordComponent } from './generate-password/generate-password.component';
import { GetDataComponent } from './get-data/get-data.component';
import { GetPayloadTokenComponent } from './get-payload-token/get-payload-token.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'confirm-account', component: ConfirmAccountComponent },
  { path: 'get-data', component: GetDataComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'ask-for-password-reset', component: AskForPasswordResetComponent },
  { path: 'generate-new-password', component: GeneratePasswordComponent },
  { path: 'get-payload-token', component: GetPayloadTokenComponent },
  { path: '**', redirectTo: 'login' },
];
