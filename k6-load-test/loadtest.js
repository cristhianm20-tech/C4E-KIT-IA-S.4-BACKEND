import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';

// Contador compartido para generar IDs únicos
let counter = 0;

// Función para generar string aleatorio
function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

/*
  SCRIPT K6 LOAD TEST: loadtest.js
  Prueba de carga para el endpoint de creación de usuarios
  - Ramp-up: 0 → 300 VUs en 60s
  - Hold: 300 VUs durante 120s
  - Ramp-down: 300 → 0 en 30s
  - Thresholds: p(95)<500ms, error rate<1%
*/

export const options = {
  stages: [
    { duration: '60s', target: 300 },  // Ramp-up a 300 VUs
    { duration: '120s', target: 300 }, // Mantener 300 VUs
    { duration: '30s', target: 0 }     // Ramp-down a 0
  ],
  thresholds: {
    'http_req_duration': ['p(95) < 500'], // 95% de las peticiones deben ser < 500ms
    'http_req_failed': ['rate < 0.01']    // Tasa de error < 1%
  }
};

export default function() {
  // Genera un identificador único combinando contador, timestamp y string aleatorio
  const id = `${++counter}_${Date.now()}_${generateRandomString(5)}`;

  // Configuración de la petición
  const url = 'http://localhost:8080/api/v1/users';
  const payload = JSON.stringify({
    username: `user${id}`,
    email: `user${id}@example.com`,
    password: 'password123'
  });
  const params = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  // Realizar la petición POST
  const response = http.post(url, payload, params);

  // Verificar la respuesta
  check(response, {
    'status es 200 o 201': (r) => r.status === 200 || r.status === 201,
    'tiempo de respuesta < 500ms': (r) => r.timings.duration < 500
  });

  // Pequeña pausa entre iteraciones
  sleep(1);
}
