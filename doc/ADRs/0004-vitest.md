# ADR 0004 — Usar Vitest para las pruebas

- **Estado:** Aceptada
- **Fecha:** 2026-10-13

## Contexto

Hasta el Sprint 1 el proyecto no tenía pruebas automatizadas: todo era contenido y maquetación, verificado con `pnpm build`, `pnpm check` y revisión visual. P-13 (Reunión 007) exige un test por cada caso en que un proyecto se muestra sin barra, así que hace falta un runner.

## Decisión

Las pruebas se escriben con **Vitest** y se ejecutan con `pnpm test`. Los archivos de prueba van junto al código que prueban, con el sufijo `.test.ts`.

## Motivos

- **Es el runner que recomienda Astro**, y usa la misma base que el build (Vite): TypeScript sin configuración extra.
- **Rápido y sin dependencias pesadas**: no levanta un navegador.
- **Permite inyectar dependencias simuladas** (`vi.fn`), suficiente para probar la consulta a GitHub sin red.

## Alternativas descartadas

- **`node:test`**: no suma dependencias, pero no ejecuta TypeScript con alias ni imports de Vite sin configuración extra.

## Consecuencias

- Antes de cerrar un cambio, además de `pnpm build` y `pnpm check`, corre `pnpm test`.
- Las pruebas cubren la lógica (como el cálculo del avance); la maquetación se sigue verificando a ojo y con Lighthouse.
