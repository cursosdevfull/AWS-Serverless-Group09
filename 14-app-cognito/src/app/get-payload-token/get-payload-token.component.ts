import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import * as jwt from 'jwt-decode';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-get-payload-token',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './get-payload-token.component.html',
  styleUrl: './get-payload-token.component.css',
})
export class GetPayloadTokenComponent {
  payload!: object;
  message = '';

  constructor(private readonly auth: AuthService) {}

  getPayloadToken() {
    if (!this.auth.getAuthenticatedUser()) this.message = 'Please login first';

    this.auth.getAuthenticatedUser()?.getSession((err: any, session: any) => {
      this.message = '';
      if (err) {
        console.log(err);
        this.payload = err;
        return;
      }

      const payload = jwt.jwtDecode(session.getIdToken().getJwtToken());
      this.payload = payload;
    });
  }
}
