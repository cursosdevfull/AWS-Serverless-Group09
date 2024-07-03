import { NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-get-data',
  standalone: true,
  imports: [NgFor],
  templateUrl: './get-data.component.html',
  styleUrl: './get-data.component.css',
})
export class GetDataComponent {
  items: Array<{ id: number; name: string }> = [];
  message = '';
  subscription!: Subscription;

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) {
    this.subscription = this.authService
      .getNotification()
      .subscribe((message) => (this.message = message));
  }

  getData() {
    if (!this.authService.getAuthenticatedUser())
      this.message = 'Please login first';

    this.authService
      .getAuthenticatedUser()
      ?.getSession((err: any, session: any) => {
        if (err) {
          console.log(err);
          return;
        }

        const token = session.getIdToken().getJwtToken();
        this.http
          .post(
            'https://0iio08jla3.execute-api.us-east-1.amazonaws.com/dev/client',
            {},
            { headers: { Authorization: token } }
          )
          .subscribe({
            next: (data: any) => {
              this.message = 'Data retrieved successfully';
              this.items = data;
            },
            error: (error: any) => {
              console.log(error);
              this.message = 'Failed to retrieve data';
            },
          });
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
