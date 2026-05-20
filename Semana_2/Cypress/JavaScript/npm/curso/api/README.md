# Cypress JavaScript - API

Proyecto de pruebas API con Cypress usando `cy.request` sobre PokeAPI y una API publica auxiliar.

## Objetivo

Practicar contract testing, DDT, edge cases y validaciones de negocio sin depender del navegador.

## Ejecutar

```powershell
npm install
npm test
```

## Archivos clave

- `cypress/e2e/api/pokeapi-contract.cy.js`: suite principal de PokeAPI.
- `cypress/e2e/api/public-api.cy.js`: ejemplos cortos contra JSONPlaceholder.
- `cypress.config.js`: configuracion de specs y soporte.
