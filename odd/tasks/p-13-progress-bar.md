# P-13 — Barra de avance de proyectos

Objetivo: barra de avance por proyecto calculada al compilar (Reunión 006, ADR 0002). Rama `feat/p-13-progress-bar`. Entrega: `single-pr`. Runner: Vitest (`pnpm test`).

## Specs

Criterios de aceptación de la Reunión 007, citados tal cual:

- **S1** "El esquema de `proyectos` suma un campo opcional `milestone`."
- **S2** "En el build se calcula issues cerrados / total, con un token de solo lectura."
- **S3** "Si la API falla, se agota el límite, el repositorio da 404, el milestone no existe o no tiene issues, el proyecto se muestra sin barra y con su `estado`. Cada caso tiene su test."
- **S4** "La barra es accesible: `role=\"progressbar\"` con su valor y contraste ≥ 4.5:1."
- **S5** "Un cron diario de GitHub Actions dispara el deploy hook de Vercel."
- **S6** "Los textos de la barra van en `i18n/es.json`."
- **S7** (ADR 0002) Todos los issues cerrados → barra al 100 %. Sin token, el build no se rompe: consulta sin autenticar.

Supuestos: `milestone` es el título del milestone; la barra se suma bajo el `estado`, no lo reemplaza.

## Tasks

| ID | Specs | Ruta | Estado | Commit |
|---|---|---|---|---|
| T1 | — | inline | pendiente | — |
| T2 | S2, S3, S7 | inline | pendiente | — |
| T3 | S1, S4, S6 | inline | pendiente | — |
| T4 | S5 | inline | pendiente | — |

- T1: Vitest + ADR 0004.
- T2: `src/lib/progress.ts` con tests de cada caso de S3 y S7.
- T3: esquema, barra en `ProjectCard`, textos.
- T4: workflow diario y documentación de secretos.

## Log

- **L1** (2026-10-13) "arranquemos con P-13"
