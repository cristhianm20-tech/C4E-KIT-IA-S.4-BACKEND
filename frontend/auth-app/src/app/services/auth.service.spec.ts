import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { of, throwError } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return success on valid credentials', (done) => {
    const credentials = { email: 'test@test.com', password: 'password123' };
    service.login(credentials).subscribe({
      next: (response) => {
        expect(response.success).toBeTrue();
        done();
      }
    });
  });

  it('should return error on invalid credentials', (done) => {
    const credentials = { email: 'wrong@test.com', password: 'wrongpass' };
    service.login(credentials).subscribe({
      error: (error) => {
        expect(error.status).toBe(401);
        done();
      }
    });
  });
});
