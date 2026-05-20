# Lite Thinking QA Master

Este repositorio contiene el laboratorio completo para los días 4 y 5 de la Semana 3.

## Estructura

- `dia-4-kafka-docker/` — Backend, Kafka y pruebas E2E.
  - `app/` — Backend Node.js (Express + KafkaJS).
  - `frontend/` — Frontend React + Vite + TypeScript.
  - `tests/` — Pruebas Playwright.
  - `docker-compose.yml` — Orquestación de Kafka y Kafka-UI.
- `dia-5-testops-cicd/` — Pipeline de CI/CD para TestOps.
  - `.github/workflows/qa-pipeline.yml` — Workflow de GitHub Actions.

## Instalación de Dependencias

**Playwright:**
En la carpeta `tests`, ejecuta:
```bash
npm install
npx playwright install --with-deps
```

**Frontend React:**
En la carpeta `frontend`, ejecuta:
```bash
npm install
```

## Instrucciones Rápidas

1. **Clona este repositorio** y entra a la carpeta `lite-thinking-qa-master`.
2. **Levanta Kafka y Kafka-UI:**
   ```bash
   cd dia-4-kafka-docker
   docker-compose up -d
   ```
3. **Instala dependencias backend:**
   ```bash
   cd app && npm install && cd ..
   ```
4. **Instala dependencias frontend:**
   ```bash
   cd frontend && npm install && cd ..
   ```
5. **Instala dependencias de pruebas y Playwright:**
   ```bash
   cd tests && npm install && npx playwright install --with-deps && cd ..
   ```
6. **Arranca backend y worker:**
   ```bash
   cd app
   npm run start-server
   # En otra terminal:
   npm run start-worker
   ```
7. **Arranca el frontend:**
   ```bash
   cd frontend
   npm run dev
   ```
8. **Corre las pruebas E2E:**
   ```bash
   cd tests
   npx playwright test --headed
   ```

## CI/CD

- El workflow de GitHub Actions (`dia-5-testops-cicd/.github/workflows/qa-pipeline.yml`) ejecuta todo el flujo automáticamente en la nube.

---

> Elimina los archivos de prueba, logs y node_modules antes de subir tu código.
