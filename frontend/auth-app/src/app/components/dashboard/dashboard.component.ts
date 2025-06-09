import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule
  ]
})
export class DashboardComponent implements OnInit {
  isLoading = true;
  userData: any = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Simulamos carga de datos
    setTimeout(() => {
      this.userData = {
        name: 'Usuario de Prueba',
        email: 'test@test.com',
        lastLogin: new Date()
      };
      this.isLoading = false;
    }, 1500);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
