# Día 4: Arquitectura de Eventos y Automatización QA

Este día incluye:
- Backend Node.js (Express + KafkaJS)
- Frontend React + Vite + TypeScript
- Pruebas E2E con Playwright
- Orquestación con Docker Compose (Kafka y Kafka-UI)

## Pasos básicos

1. Levanta Kafka:
   ```bash
   docker-compose up -d
   ```
2. Instala dependencias backend y frontend:
   ```bash
   cd app && npm install && cd ..
   cd frontend && npm install && cd ..
   cd tests && npm install && npx playwright install --with-deps && cd ..
   ```
3. Arranca backend y worker:
   ```bash
   cd app
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
