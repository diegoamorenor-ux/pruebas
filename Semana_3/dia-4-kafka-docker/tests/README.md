# Dia 4 - Tests Playwright

Pruebas E2E del flujo asíncrono con Kafka.

## Requisitos

- Node.js 18+
- Backend activo en http://localhost:3000
- Kafka y worker activos

## Instalar

```bash
npm install
```

Si quieres ejecutar en navegadores reales localmente:

```bash
npm run install:browsers
```

## Ejecutar

```bash
npm test
```

## Ver reporte HTML

```bash
npm run report
```

## Test plans por separado

```bash
npm run test:ui-polling
npm run test:api-pool
npm run test:distribucion
```

## Ejecutar visible (opcional clase)

```bash
npx playwright test --headed
```

## Resultado esperado

- Test plan smoke: evidencia estado inmediato no terminal.
- Test plan polling: registra checkpoints y tiempo de respuesta.
- Test plan API pool: mismo target, casos 5/10/15 + timeout.
- Test plan distribucion: valida regla 80/20 con evidencia adjunta.
