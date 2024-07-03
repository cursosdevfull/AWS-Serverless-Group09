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
  selector: 'app-generate-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './generate-password.component.html',
  styleUrl: './generate-password.component.css',
})
export class GeneratePasswordComponent {
  fg: FormGroup;
  message = '';
  subscription!: Subscription;

  constructor(private readonly authService: AuthService) {
    this.fg = new FormGroup({
      username: new FormControl('', Validators.required),
      code: new FormControl('', Validators.required),
      newPassword: new FormControl('', Validators.required),
    });
    this.subscription = this.authService
      .getNotification()
      .subscribe((message) => (this.message = message));
  }

  generatePassword() {
    const { username, code, newPassword } = this.fg.value;

    this.authService.generateNewPassword(username, code, newPassword);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
