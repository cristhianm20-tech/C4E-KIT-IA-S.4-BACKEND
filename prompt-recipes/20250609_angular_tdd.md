---
title: "Proyecto Frontend Angular 19 – Login TDD & Responsive (ES)"
date: 2025-06-09
author: "Equipo IA"
tags: [angular19, frontend, login, responsive, tdd, skeleton, pruebas, r-f-c-e]
---

# Contexto
Este recipe genera un prompt que guía al modelo paso a paso para crear un proyecto Angular 19 centrado en un flujo de autenticación por correo y contraseña, con diseño responsive, enfoque TDD, uso de skeleton loader tras login exitoso y manejo de errores. Las pruebas con Jasmine/TestBed deben lograr al menos 90 % de cobertura.

# Prompt (ES)
Eres un Desarrollador Front-End Senior experto en Angular 19, diseño responsive y TDD.  
Devuélveme la estructura de un proyecto Angular 19 completo, incluyendo:  
  1. `login.component.ts` y `login.component.html` con formulario reactivo validado (Validators.required, Validators.email, mínimo 8 caracteres en password) y estilos responsive (Flex/Grid).  
  2. Servicio `AuthService` simulado que devuelve `of({ success: true })` o `throwError({ status: 401 })`.  
  3. `dashboard.component.ts` y `dashboard.component.html` con un skeleton loader (div animado) que se muestre tras login exitoso antes de cargar contenido.  
  4. Módulo de rutas (`app-routing.module.ts`) que redirija a `/dashboard` tras login y proteja la ruta si no está autenticado.  
  5. Pruebas unitarias (Jasmine/TestBed) en `src/test.ts` para `LoginComponent` y `DashboardComponent` que cubran:  
     - Validación de formulario (email inválido, password vacío).  
     - Llamada a `AuthService.login()` y manejo de `success` y `401`.  
     - Navegación a `/dashboard` en éxito y visualización de skeleton loader.  
     - Visualización de mensaje de error en fallo 401.  
  6. Configuración de TDD: primero escribe los specs `.spec.ts`, luego implementa el código para pasar las pruebas.  
  7. Asegura que `ng test` arroje ≥ 90 % de cobertura en el paquete `app`.  
Usa Angular ReactiveForms, FlexLayout o CSS Grid, Jasmine, TestBed, HttpClientTestingModule, RouterTestingModule y mocks de `AuthService`.  
El proyecto debe compilar con `ng serve`, `ng test` pasa todos los tests, y el reporte de cobertura (`coverage/index.html`) indica ≥ 90 % en `src/app`.

Asegurate de responder siempre en español

# Ejemplo de respuesta (ES)

```typescript
// login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  submit(): void {
    if (this.loginForm.invalid) return;
    this.auth.login(this.loginForm.value).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => err.status === 401 && (this.errorMessage = 'Credenciales inválidas')
    });
  }
}
