import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  fg: FormGroup;
  message = '';
  subscription!: Subscription;

  constructor(private readonly authService: AuthService) {
    this.fg = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
    this.subscription = this.authService
      .getNotification()
      .subscribe((message) => (this.message = message));
  }

  login() {
    const { username, password } = this.fg.value;

    this.authService.signIn(username, password);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
