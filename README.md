# Auditoría-Back

Backend API para el ejercicio de la asignatura "Auditoría".  
Este proyecto es la API que se utiliza para evaluar y mejorar las partes vulnerables de una web; sirve como backend de ejemplo para detectar fallos, practicar técnicas de auditoría (SAST/DAST), y aplicar buenas prácticas de seguridad y arquitectura.

---

Índice
- Descripción
- Objetivos del proyecto
- Arquitectura
- Tecnologías
- Estructura del proyecto
- Instalación y ejecución
- Variables de entorno
- Endpoints principales
- Ejemplos de uso (cURL)
- Buenas prácticas aplicadas
- Checklist de auditoría y recomendaciones de mejora
- Testing y herramientas recomendadas
- Contribuir
- Licencia
- Contacto

---

Descripción
Este repositorio contiene la API que apoya al ejercicio de auditoría. La idea es disponer de un backend funcional con puntos intencionalmente fáciles de auditar y reforzar, permitiendo:
- Evaluar autenticación y autorización.
- Encontrar y corregir inyecciones, XSS, CSRF y problemas de manejo de sesiones.
- Practicar el uso de herramientas automáticas y manuales de auditoría.
- Implementar mejoras y comprobar su efectividad.

Objetivos del proyecto
- Proveer un backend simple pero realista para prácticas de auditoría.
- Documentar la arquitectura y las decisiones de seguridad.
- Mostrar y aplicar buenas prácticas de desarrollo seguro.

Arquitectura
- API RESTful simple dividida en capas:
  - Capa de presentación: routers y controladores (endpoints).
  - Capa de negocio: servicios que contienen la lógica de la aplicación.
  - Capa de persistencia: repositorios / modelos (p. ej. usando ORM).
  - Capa de infraestructura: conexión a DB, cache, cola (si aplica).
- Conceptos aplicados:
  - Separación de responsabilidades (controllers → services → repositories).
  - Inyección de dependencias mínima para facilitar testing.
  - Middleware para seguridad, validación, logging y manejo de errores.
  - Configuración a través de variables de entorno (no hardcodear secretos).

Tecnologías
- Node.js + Express (o framework equivalente) — API REST.
- Base de datos: (por ejemplo) PostgreSQL / MongoDB — según configuración.
- ORM/ODM: Sequelize / TypeORM / Mongoose — según implementación.
- JWT para autenticación basada en tokens (opcional: sesiones con cookies seguras).
- Herramientas de desarrollo: eslint, prettier, jest/mocha para tests, nodemon en desarrollo.
- Contenedores: Docker + docker-compose (opcional).

Estructura del proyecto (ejemplo)
- src/
  - controllers/
  - services/
  - repositories/
  - middlewares/
  - models/
  - routes/
  - utils/
  - config/
  - app.js / index.js
- tests/
- docker/
- .env.example
- README.md

Instalación y ejecución
1. Clona el repositorio:
   git clone https://github.com/david123456858/auditoria-Back.git
2. Entra al directorio:
   cd auditoria-Back
3. Instala dependencias:
   npm install
4. Copia y adapta el archivo de variables de entorno:
   cp .env.example .env
5. Ejecuta en desarrollo:
   npm run dev
6. Ejecuta en producción:
   npm start
7. (Opcional) Con Docker:
   docker-compose up --build

Variables de entorno (mínimas recomendadas)
- PORT=3000
- NODE_ENV=development
- DATABASE_URL=postgres://user:pass@host:port/dbname
- JWT_SECRET=tu_secreto_super_seguro
- JWT_EXPIRES_IN=1h
- LOG_LEVEL=info
- CORS_ORIGIN=https://tu-frontend.example

Asegúrate de NO subir .env ni secretos al repositorio.

Endpoints principales (ejemplo)
- POST /api/auth/register — registrar usuario (body: {email, password, ...})
- POST /api/auth/login — login, devuelve JWT (body: {email, password})
- GET /api/users — lista de usuarios (protegido, role-based)
- GET /api/users/:id — obtener usuario (autorización)
- POST /api/items — crear recurso (validación input)
- GET /api/items — listar recursos (paginación)
- PUT /api/items/:id — actualizar (autorización)
- DELETE /api/items/:id — eliminar (autorización)

Ejemplos de uso (cURL)
- Registro:
  curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"S3cureP@ss"}'
- Login:
  curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"S3cureP@ss"}'
- Llamada protegida:
  curl -H "Authorization: Bearer <TOKEN>" http://localhost:3000/api/users

Buenas prácticas aplicadas
- Validación estricta de inputs con librería (p. ej. Joi / express-validator).
- Sanitización de datos recibidos para evitar inyección.
- Uso de parámetros preparados / ORM para consultas a BD.
- Gestión de errores consistente (HTTP codes adecuados, no revelar stack en producción).
- Logging estructurado (p. ej. winston/pino) con niveles y redacción de logs sensibles.
- CORS configurado con orígenes permitidos.
- Seguridad en cookies (HttpOnly, Secure, SameSite=strict cuando aplique).
- Rate limiting y protección contra fuerza bruta en endpoints críticos (login).
- Escaneo de dependencias (npm audit, Snyk, Dependabot).
- Tests unitarios y de integración básicos.

Checklist de auditoría y recomendaciones de mejora
- Autenticación & Sesiones:
  - ¿Se almacena el JWT/clave de forma segura? Revisar expiración y rotación.
  - ¿Existe verificación de token revocado / blacklisting?
- Autorización:
  - Revisa control de acceso por rol y por recurso (IDOR).
  - Prueba acceso horizontal/vertical (acceder a recursos de otros usuarios).
- Validación & Sanitización:
  - Campo por campo, tanto server-side como en la base de datos.
  - Evitar eval() y construcciones dinámicas inseguras.
- Inyección:
  - Usa prepared statements/ORM, evita concatenar queries.
  - Revisa puntos de entrada para NoSQL injection (si aplica).
- XSS & Output Encoding:
  - Codifica datos antes de devolverlos si se renderizan en cliente.
- CSRF:
  - Si se usan cookies para auth, proteger con tokens CSRF.
- Configuración y despliegue:
  - Parámetros de producción en env vars, no en código.
  - Forzar HTTPS, HSTS, y cabeceras de seguridad (Content-Security-Policy, X-Frame-Options, X-Content-Type-Options).
- Gestión de secretos:
  - No subir claves/contraseñas a VCS.
  - Usar vaults o secret managers para producción.
- Dependencias:
  - Ejecutar escaneo automático y parcheo.
- Logging & Monitoreo:
  - No loguear PII ni contraseñas.
  - Implementar alertas y retención de logs.
- Manejo de errores:
  - No exponer trazas en producción, logs separados con correlación de request IDs.

Recomendaciones específicas de mejora (acciones concretas)
- Implementar rate limiting en /auth/login y endpoints costosos.
- Añadir validación por esquemas en todos los endpoints (Joi/TypeBox).
- Añadir tests para casos de autorización (acceso no autorizado, IDOR).
- Integrar CI que ejecute linters, tests y escaneo de vulnerabilidades.
- Añadir políticas de CORS estrictas y cabeceras de seguridad con helmet.
- Implementar refresco de tokens (refresh tokens con rotación y revocación).
- Usar Content Security Policy si la API sugiere frontend integrado.

Testing y herramientas recomendadas
- Unit & Integration tests: Jest / Mocha + Supertest.
- SAST: SonarQube, Semgrep.
- DAST: OWASP ZAP, Burp Suite (para pruebas de penetración manual/automática).
- Dependency scanning: Snyk, Dependabot, npm audit.
- Fuzzing / input mutation: zzuf, wfuzz o herramientas específicas para APIs.
- Escaneo de contenedores: Trivy.

Cómo contribuir
1. Abre un issue describiendo el cambio o la vulnerabilidad detectada.
2. Crea una rama con nombre descriptivo: feature/tu-cambio o fix/descripcion.
3. Añade tests que demuestren el fallo (si aplica) y la corrección.
4. Envía un pull request con descripción clara y enlaces a issues o pruebas.
5. El mantenimiento validará y solicitará cambios si es necesario.

Licencia
- MIT (o la que prefieras). Añade un archivo LICENSE en la raíz con la licencia escogida.

Contacto
- Autor / Equipo: (añade aquí tu nombre o email)
- Repo: https://github.com/david123456858/auditoria-Back

---

Apéndice: Guía corta para la actividad de la asignatura
1. Objetivo: Detectar 3 vulnerabilidades, documentarlas y corregirlas.
2. Procedimiento:
   - Revisión estática del código (SAST).
   - Pruebas dinámicas (DAST) contra la instancia de la API.
   - Revisión manual de control de acceso y manejo de sesiones.
   - Proponer y aplicar parches.
3. Entregable:
   - Informe con vulnerabilidades encontradas, evidencia (requests/responses), y PRs o commits que parcheen los problemas.
4. Evaluación:
   - Claridad de la evidencia, calidad de soluciones, tests que mitiguen la regresión, y uso de buenas prácticas.

Si quieres, puedo:
- Generar un archivo .env.example con las variables recomendadas.
- Crear una checklist en formato ISSUE para documentar las vulnerabilidades encontradas.
- Escribir ejemplos concretos de pruebas con OWASP ZAP o comandos curl para exploits comunes (IDOR, SQLi, XSS).
