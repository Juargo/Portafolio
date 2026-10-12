# ADR 0001 — Usar pnpm en lugar de npm

- **Estado:** Aceptada
- **Fecha:** 2026-10-11

## Contexto

El proyecto se creó con npm: los comandos del `README.md` y del `CLAUDE.md` usan `npm`, y el lockfile versionado es `package-lock.json`.

## Decisión

El gestor de paquetes del proyecto pasa a ser **pnpm**.

## Motivos

- **Dependencias estrictas.** pnpm no expone en `node_modules` los paquetes que no están declarados en `package.json`, así que un import de una dependencia transitiva falla en local y no después, en el build de Vercel.
- **Instalaciones más rápidas y livianas.** Los paquetes se guardan una sola vez en un almacén global y cada proyecto los enlaza en vez de copiarlos.
- **Compatible con Vercel.** Vercel detecta pnpm por la presencia de `pnpm-lock.yaml`. Sin más configuración, elige la versión según el `lockfileVersion` del lockfile (`9.0` → pnpm 9 o 10), no según `package.json`.

## Consecuencias

- Se reemplaza `package-lock.json` por `pnpm-lock.yaml`. No deben convivir los dos lockfiles.
- Se fija la versión en `package.json` con el campo `packageManager`. Vercel solo lo respeta a través de Corepack, así que el proyecto en Vercel debe tener la variable de entorno `ENABLE_EXPERIMENTAL_COREPACK=1`; sin ella, el build puede correr con otra versión mayor de pnpm.
- Los comandos del `README.md` y del `CLAUDE.md` pasan a `pnpm install`, `pnpm dev`, `pnpm build`, `pnpm preview` y `pnpm check`.
- Quien clone el repositorio necesita pnpm instalado (por ejemplo, con `corepack enable`).
