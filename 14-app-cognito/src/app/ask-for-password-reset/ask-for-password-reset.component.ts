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
  selector: 'app-ask-for-password-reset',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './ask-for-password-reset.component.html',
  styleUrl: './ask-for-password-reset.component.css',
})
export class AskForPasswordResetComponent {
  fg: FormGroup;
  message = '';
  subscription!: Subscription;

  constructor(private readonly authService: AuthService) {
    this.fg = new FormGroup({
      username: new FormControl('', Validators.required),
    });
    this.subscription = this.authService
      .getNotification()
      .subscribe((message) => (this.message = message));
  }

  askForReset() {
    const { username } = this.fg.value;

    this.authService.askForPasswordReset(username);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
