import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;

  constructor() { }

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    // Simulamos autenticación - en un caso real, esto haría una llamada HTTP
    if (credentials.email === 'test@test.com' && credentials.password === 'password123') {
      this.isAuthenticated = true;
      return of({ success: true });
    }
    return throwError(() => ({ status: 401, message: 'Credenciales inválidas' }));
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  logout(): void {
    this.isAuthenticated = false;
  }
}
