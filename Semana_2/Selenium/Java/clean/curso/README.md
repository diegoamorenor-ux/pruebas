# Selenium Java Clean

Curso dividido en dos proyectos para evitar mezclar enfoques:

- `e2e`: pruebas UI/frontend con Selenium (sin Maven).
- `api`: pruebas API con JDK HttpClient + JUnit 5 (sin Maven).

## Ejecutar E2E

```powershell
./run-e2e.ps1
```

## Ejecutar API

```powershell
./run-api.ps1
```

## Notas

- `lib/` y `config/` son compartidos por `e2e` y `api`.
- Cada subproyecto compila a su propia carpeta bin (`e2e/bin` y `api/bin`).
