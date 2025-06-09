---
title: "Proyecto Base RESTful Usuarios – Java 17, Spring Boot, Gradle, TDD (CoT)"
date: 2025-06-06
author: "Cristhian Camilo Medina Solano"
tags: [java, gradle, springboot, h2, tdd, mockito, junit, chain-of-thought]
---

# Contexto
Este recipe define un prompt que utiliza la técnica de **Chain‐of‐Thought** para guiar al modelo paso a paso en la creación de un proyecto base en Java 17 con Spring Boot y Gradle. El objetivo es generar un servicio RESTful completo con CRUD para la entidad `User` (persistencia en H2) bajo el enfoque de **Test‐Driven Development (TDD)**, empleando **JUnit 5** y **Mockito** para asegurar una cobertura de pruebas unitarias superior al 90 %.

# Prompt (ES)
Eres un Ingeniero Backend Senior con experiencia en Java 17, Spring Boot, Gradle y TDD.  
Razona paso a paso (máximo 7 pasos en español) cómo crearías desde cero un **proyecto Gradle** que incluya:  
  1. Configuración de Gradle para Spring Boot 3.x en Java 17.  
  2. Dependencias de Spring Boot Web, Data JPA, H2, Lombok, JUnit 5 y Mockito.  
  3. Estructura de paquetes recomendada (`entity`, `repository`, `service`, `controller`, `dto`, `test`).  
  4. Entidad `User` con campos:  
     - `id` (UUID, PK, autogenerado)  
     - `username` (String, no nulo, único)  
     - `email` (String, validación `@Email`, no nulo)  
     - `password` (String, mínima longitud 8)  
     - `createdAt` (LocalDateTime, generado al crear).  
  5. Repositorio Spring Data JPA para `User`.  
  6. Servicio `UserService` con métodos CRUD básicos, lanzando `EntityNotFoundException` cuando sea necesario.  
  7. Controlador REST `UserController` con rutas:  
     - `GET /api/v1/users` (listar todos)  
     - `GET /api/v1/users/{id}` (obtener por ID)  
     - `POST /api/v1/users` (crear — devuelve 201 + Location)  
     - `PUT /api/v1/users/{id}` (actualizar)  
     - `DELETE /api/v1/users/{id}` (eliminar — devuelve 204).  
  8. Archivo `application.properties` configurado para H2 en memoria.  
  9. Configuración de TDD: primero escribir pruebas unitarias en JUnit 5 + Mockito para cada capa (entity se omite pruebas, pero repository, service y controller sí).  
  10. Asegurar que cada clase tiene su correspondiente test en `src/test/java/...` y que la cobertura sea ≥ 90 %.  
  11. Incluir en el build.gradle plugins y configuraciones necesarias para ejecutar pruebas con cobertura (p. ej., JaCoCo).  
Luego, genera el proyecto completo, incluyendo:  
  - `build.gradle`  
  - `src/main/java/com/example/demo/...` con las clases:  
    - `DemoApplication.java`  
    - `entity/User.java`  
    - `repository/UserRepository.java`  
    - `service/UserService.java`  
    - `service/impl/UserServiceImpl.java`  
    - `controller/UserController.java`  
    - `dto/UserDTO.java` (si aplica), y mapeo básico.  
  - `src/main/resources/application.properties`  
  - `src/test/java/com/example/demo/...` con pruebas:  
    - `repository/UserRepositoryTest.java` (prueba de integración con H2)  
    - `service/UserServiceTest.java` (pruebas unitarias con Mockito)  
    - `controller/UserControllerTest.java` (tests con MockMvc y Mockito)  
  - Configuración de cobertura con JaCoCo (para Gradle).  
El proyecto debe compilar con `./gradlew build`, `./gradlew test` debe pasar todos los tests y el reporte de JaCoCo debe indicar cobertura del 90 % o superior en el paquete principal `com.example.demo`.

Asegurate de responder siempre en Español

# Ejemplo de salida esperada (ES)

```text
**Razonamiento paso a paso:**
1. **Inicializar proyecto Gradle**  
   - Ejecutar `gradle init --type java-application` → configurar Java 17.  
   - Modificar `build.gradle` para usar plugins `org.springframework.boot` y `io.spring.dependency-management`.  
2. **Declarar dependencias**  
   - Agregar en `dependencies` de Gradle:  
     ```groovy
     implementation 'org.springframework.boot:spring-boot-starter-web'
     implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
     runtimeOnly 'com.h2database:h2'
     implementation 'org.projectlombok:lombok'
     annotationProcessor 'org.projectlombok:lombok'
     testImplementation 'org.springframework.boot:spring-boot-starter-test'
     testImplementation 'org.mockito:mockito-core:4.0.0'
     ```  
   - Incluir plugin `jacoco` para cobertura.  
3. **Configurar paquetes y clase principal**  
   - Crear estructura `src/main/java/com/example/demo/`.  
   - Generar `DemoApplication.java` con `@SpringBootApplication`.  
4. **Definir entidad `User`**  
   - En `entity/User.java`:  
     - Anotar `@Entity`, `@Table("users")`, usar Lombok (`@Data`, `@Builder`, `@NoArgsConstructor`, `@AllArgsConstructor`).  
     - Campos con anotaciones `@Id @GeneratedValue UUID id`, `@Column(nullable=false, unique=true) String username`, `@Email @Column(nullable=false, unique=true) String email`, `@Column(nullable=false) String password`, `LocalDateTime createdAt = LocalDateTime.now()`.  
5. **Crear repositorio**  
   - En `repository/UserRepository.java`:  
     ```java
     public interface UserRepository extends JpaRepository<User, UUID> { }
     ```  
6. **Implementar servicio TDD**  
   - Primero escribir prueba `UserServiceTest.java` en `src/test/java/com/example/demo/service`:  
     - Mockear `UserRepository` con Mockito.  
     - Probar `create`, `getById`, `getAll`, `update`, `delete` (casos positivos y excepciones).  
   - Luego, implementar `UserService` y `UserServiceImpl` para pasar las pruebas.  
7. **Implementar controlador TDD**  
   - Escribir `UserControllerTest.java` con `@WebMvcTest(UserController.class)` y `MockMvc`:  
     - Probar GET `/api/v1/users`, GET `/api/v1/users/{id}` (200/404), POST `/api/v1/users` (201/400), PUT y DELETE.  
   - Implementar `UserController` inyectando `UserService` y levantando las excepciones con códigos HTTP adecuados.  
8. **Configurar H2 y application.properties**  
   - `spring.datasource.url=jdbc:h2:mem:testdb`  
   - `spring.datasource.driverClassName=org.h2.Driver`  
   - `spring.jpa.hibernate.ddl-auto=update`  
   - `spring.h2.console.enabled=true`  
9. **Ejecutar y verificar cobertura**  
   - Ejecutar `./gradlew build` → compila.  
   - Ejecutar `./gradlew test jacocoTestReport` → revisar `build/reports/jacoco/test/html/index.html` → cobertura ≥ 90 %.  
10. **Resultado final**  
    - Proyecto completo con estructura, código y tests que cumplen todos los requisitos.  