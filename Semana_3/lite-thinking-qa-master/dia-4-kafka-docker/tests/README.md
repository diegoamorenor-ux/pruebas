# Dia 4 - Tests Playwright

Pruebas E2E del flujo asíncrono con Kafka.

## Requisitos

- Node.js 18+
- Backend activo en http://localhost:3000
- Kafka y worker activos

## Instalar

```bash
npm install
npx playwright install --with-deps
```

## Ejecutar

```bash
npm test
```

## Ejecutar visible (opcional clase)

```bash
npx playwright test --headed
```

## Resultado esperado

- Test de polling debe pasar y evidenciar consistencia eventual.
