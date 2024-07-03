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
  selector: 'app-confirm-account',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './confirm-account.component.html',
  styleUrl: './confirm-account.component.css',
})
export class ConfirmAccountComponent {
  fg: FormGroup;
  message = '';
  subscription!: Subscription;

  constructor(private readonly authService: AuthService) {
    this.fg = new FormGroup({
      username: new FormControl('', Validators.required),
      code: new FormControl('', Validators.required),
    });
    this.subscription = this.authService
      .getNotification()
      .subscribe((message) => (this.message = message));
  }

  confirmAccount() {
    const { username, code } = this.fg.value;
    this.authService.confirmRegistration(username, code);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
