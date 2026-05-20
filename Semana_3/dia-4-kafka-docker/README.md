# Día 4: Arquitectura de Eventos y Automatización QA

Este dia usa una app de clase (simple) para practicar un flujo asincrono end-to-end.

Este ejercicio incluye:
- Backend Node.js (Express + KafkaJS) en `backend/`
- Frontend React + Vite + TypeScript
- Pruebas E2E con Playwright
- Orquestación con Docker Compose (Kafka y Kafka-UI)

## Pasos básicos

1. Levanta Kafka:
   ```bash
   docker-compose up -d
   ```
   El topic `transferencias-creadas` se crea automaticamente al iniciar los contenedores.
   Kafka UI se conecta por red interna (`kafka:29092`) y la app local por host (`localhost:9092`).
2. Instala dependencias backend y frontend:
   ```bash
   cd backend && npm install && cd ..
   cd frontend && npm install && cd ..
   cd tests && npm install && npx playwright install --with-deps && cd ..
   ```
3. Arranca backend y worker:
   ```bash
   cd backend
   npm run start-server
   # En otra terminal:
   npm run start-worker
   ```
4. Arranca el frontend:
   ```bash
   cd frontend
   npm run dev
   ```
5. Corre las pruebas E2E:
   ```bash
   cd tests
   npx playwright test --headed
   ```

## Objetivo de aprendizaje

- Ver el cambio de estado `PENDIENTE -> APROBADO` despues del procesamiento asincrono.
- Entender por que en E2E se debe esperar/pollear estado y no asumir respuesta inmediata.

## Prueba manual en PowerShell (muy clara)

Ejecuta los comandos desde PowerShell para validar el flujo.

### 1) Crear transferencia

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/transfer" -Method Post -ContentType "application/json" -Body '{"target":"98765","amount":150}'
```

Respuesta esperada (ejemplo):

```text
id               status
--               ------
TX-1779309030082 PENDIENTE
```

### 2) Error comun: usar un ID placeholder

Si consultas con `TX-XXXXXXXXXXXX`, el sistema responde `NO_ENCONTRADO` porque ese ID no existe.

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/status/TX-XXXXXXXXXXXX"
```

Respuesta esperada:

```text
id              status
--              ------
TX-XXXXXXXXXXXX NO_ENCONTRADO
```

### 3) Consulta correcta con el ID real

Usa el `id` real devuelto en el paso 1.

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/status/TX-1779309030082"
```

Respuesta esperada (despues del procesamiento asincrono):

```text
id               status
--               ------
TX-1779309030082 APROBADO
```

Nota: con la configuracion actual el worker tarda aproximadamente 10 segundos en pasar de `PENDIENTE` a `APROBADO`.

## Estructura recomendada

- `backend/`: solo API y worker Kafka.
- `frontend/`: unica UI (React + Vite).
- `tests/`: test plans y test cases automatizados.
- `app/`: compatibilidad temporal para comandos antiguos (`npm run start-server` y `npm run start-worker`).
