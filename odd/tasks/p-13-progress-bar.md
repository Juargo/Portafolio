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
| T1 | — | inline | hecho | fdf2a24 |
| T2 | S2, S3, S7 | inline | hecho (RED → GREEN, 13 tests) | 9fe45e4 |
| T3 | S1, S4, S6 | inline | hecho | 2609501 |
| T4 | S5 | inline | hecho (secreto pendiente) | b0cc71f |

- T1: Vitest + ADR 0004.
- T2: `src/lib/progress.ts` con tests de cada caso de S3 y S7.
- T3: esquema, barra en `ProjectCard`, textos.
- T4: workflow diario y documentación de secretos.

## Log

- **L1** (2026-10-13) "arranquemos con P-13"
- **L2** Verificación: `pnpm build`, `pnpm check` y `pnpm test` (13/13) sin errores. Prueba manual contra la API real (facebook/react): milestone parcial 54 %, completo 100 %, inexistente sin barra y con aviso `[avance]`. Lighthouse con barras: 100/100/100/100. Sin desborde a 375 y 1280 px.
- **L3** Pendiente externo: crear `GH_PROGRESS_TOKEN` en Vercel, `VERCEL_DEPLOY_HOOK` en GitHub, y cargar `repo`/`milestone` en cada proyecto.
- **L4** Revisión Gentle AI aprobada (riesgo, resiliencia, confiabilidad) con avisos no bloqueantes. Se corrigieron en `35f5db3` con test previo (RED → GREEN, 17 tests): un 200 con el último request del límite se descartaba; un token vencido no reintentaba sin autenticar; un cuerpo que no es lista rompía el build. La revisión de la corrección se omitió por decisión del usuario.
