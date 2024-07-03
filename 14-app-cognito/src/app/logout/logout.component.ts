import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css',
})
export class LogoutComponent {
  constructor(
    private readonly auth: AuthService,
    private readonly router: Router
  ) {}

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
