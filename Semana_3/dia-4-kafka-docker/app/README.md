# Dia 4 - App Backend

Backend Express con productor Kafka y worker para flujo asíncrono.

## Requisitos

- Node.js 18+
- Kafka activo en localhost:9092

## Instalar

```bash
npm install
```

## Ejecutar servidor

```bash
npm run start-server
```

## Ejecutar worker (en otra terminal)

```bash
npm run start-worker
```

## Verificación

- API y UI backend: http://localhost:3000
- Debe registrar mensajes Kafka y cambio de estado a APROBADO.
