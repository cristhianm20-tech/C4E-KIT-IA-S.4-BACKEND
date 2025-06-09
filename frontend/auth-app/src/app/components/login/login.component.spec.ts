import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate required fields', () => {
    const form = component.loginForm;
    expect(form.valid).toBeFalse();
    expect(form.get('email')?.errors?.['required']).toBeTrue();
    expect(form.get('password')?.errors?.['required']).toBeTrue();
  });

  it('should validate email format', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.errors?.['email']).toBeTrue();
    
    emailControl?.setValue('valid@email.com');
    expect(emailControl?.errors?.['email']).toBeFalsy();
  });

  it('should validate password length', () => {
    const passwordControl = component.loginForm.get('password');
    passwordControl?.setValue('123');
    expect(passwordControl?.errors?.['minlength']).toBeTruthy();
    
    passwordControl?.setValue('password123');
    expect(passwordControl?.errors?.['minlength']).toBeFalsy();
  });

  it('should navigate to dashboard on successful login', () => {
    authService.login.and.returnValue(of({ success: true }));
    const form = component.loginForm;
    form.setValue({
      email: 'test@test.com',
      password: 'password123'
    });
    
    component.onSubmit();
    expect(authService.login).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should show error message on login failure', () => {
    authService.login.and.returnValue(throwError(() => ({ status: 401 })));
    const form = component.loginForm;
    form.setValue({
      email: 'wrong@test.com',
      password: 'wrongpass'
    });
    
    component.onSubmit();
    expect(authService.login).toHaveBeenCalled();
    expect(component.errorMessage).toBe('Credenciales inválidas');
  });
});
