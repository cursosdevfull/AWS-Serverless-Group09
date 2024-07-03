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
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  fg: FormGroup;
  message = '';
  subscription!: Subscription;

  constructor(private readonly authService: AuthService) {
    this.fg = new FormGroup({
      username: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      family_name: new FormControl('', Validators.required),
    });

    this.subscription = this.authService
      .getNotification()
      .subscribe((message: any) => (this.message = message));
  }

  register() {
    const { username, email, password, family_name } = this.fg.value;
    this.authService.signUp(username, email, password, family_name);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
