---
title: "K6 Load Test – ES"
date: 2025-06-09
author: "Cristhian Camilo Medina Solano"
tags: [k6, load-test, performance, r-f-c-e]
---

# Contexto
Usa este prompt recipe para generar scripts de prueba de carga en k6 que simulen tráfico concurrente a un endpoint API y verifiquen métricas de latencia y éxito.

# Prompt (ES)
Eres un Performance Tester Senior experto en k6 y pruebas de carga de APIs.  
Devuélveme un archivo JavaScript llamado `loadtest.js` listo para ejecutar con `k6 run loadtest.js`, con comentarios en español explicando cada sección.  
  1. Prueba de carga al endpoint POST `http://localhost:8080/api/v1/users` con payload JSON:
     ```json
     {
      "username": "johndoe",
      "email": "john@example.com",
      "password": "password123"
      }
     ```  
  2. Etapas (`stages`):
     - Ramp-up de 0 a 300 VUs en 60 s.  
     - Mantener 300 VUs durante 120 s.  
     - Ramp-down a 0 en 30 s.  
  3. Umbrales (`thresholds`):
     - 95 % de solicitudes (`http_req_duration`) < 500 ms.  
     - Tasa de errores (`http_req_failed`) < 1 %.  
Al ejecutar `k6 run loadtest.js` debe completarse sin errores, y el reporte en consola debe mostrar p(95)<500 ms y error rate<1 %.

Asegurate de responder siempre en Español 

# Ejemplo de Respuesta (ES)

```javascript
import http from "k6/http";
import { check, sleep } from "k6";

/*
  SCRIPT K6 LOAD TEST: loadtest.js
  - Ramp-up: 0 → 300 VUs en 60s
  - Hold: 300 VUs durante 120s
  - Ramp-down: 300 → 0 en 30s
  - Thresholds: p(95)<500ms, error rate<1%
*/

export let options = {
  stages: [
    { duration: "60s", target: 300 },
    { duration: "120s", target: 300 },
    { duration: "30s", target: 0 }
  ],
  thresholds: {
    "http_req_duration": ["p(95)<500"],
    "http_req_failed": ["rate<0.01"]
  }
};

export default function() {
  const url = "https://api.ejemplo.com/v1/login";
  const payload = JSON.stringify({
    username: "usuarioPrueba",
    password: "ClaveSecreta123"
  });
  const params = { headers: { "Content-Type": "application/json" } };

  let res = http.post(url, payload, params);

  check(res, {
    "status 200": (r) => r.status === 200,
    "latency < 500ms": (r) => r.timings.duration < 500
  });

  sleep(1);
}
