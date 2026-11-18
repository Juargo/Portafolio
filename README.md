# Portafolio — Jorge Retamal

Página de servicios de **Jorge te lo resuelve**: redes, software, IA, consultoría para adulto mayor, cámaras y domótica. Astro + Vercel, bilingüe ES/EN.

## Correr el proyecto

```bash
pnpm install
pnpm dev          # http://localhost:4321
pnpm build        # genera dist/
pnpm preview      # sirve dist/
pnpm check        # tipos y accesibilidad
```

## Dónde está cada cosa

```
src/
  i18n/es.json         todos los textos (servicios, pasos, contacto); en.json igual
  site.ts              marca, WhatsApp, correo, LinkedIn
  assets/jorge.jpg     foto del hero
  assets/fonts/        Figtree y Atkinson Hyperlegible
  components/          Header, Hero, Servicios, Como, Contacto, Footer
  layouts/Base.astro   <head>, header y pie
  pages/
    index.astro        raíz: salta a /es/
    [lang]/index.astro la página, en /es/ y /en/
  styles/global.css    tokens "cercano y claro" y utilidades
```

**Para agregar o cambiar un servicio** no hace falta tocar código: edita
`servicios.items` en `src/i18n/es.json` y `en.json`. Cada servicio tiene
`icono` (red, software, ia, adultoMayor, camara o domotica), `titulo` y `texto`.

## Sistema visual

Títulos en **Figtree** y texto en **Atkinson Hyperlegible** (ADR 0006).

| Rol | Variable | Hex |
|---|---|---|
| Fondo | `--cream` | `#fbf8f3` |
| Tarjetas | `--white` / `--mint` | `#ffffff` / `#e8f1ee` |
| Texto | `--ink` | `#1f2421` |
| Texto secundario | `--ink-soft` | `#3e4541` |
| Acento | `--teal` | `#0f5e57` |

## Idiomas

`astro.config.mjs` declara `es` (por defecto) y `en`, ambos con prefijo de ruta.
La raíz redirige a `/es/`: al instante en Vercel vía `vercel.json`, y con
`src/pages/index.astro` como respaldo en local.

Los textos de los dos idiomas viven en `src/i18n/es.json` y `en.json`, con las mismas claves.

## Desplegar en Vercel

1. Sube el repo a GitHub.
2. En Vercel, importa el repo. Detecta Astro solo; no hay que configurar nada.
3. Define la variable de entorno `SITE_URL` con la URL final (la usa el sitemap
   y las URL canónicas).

## Pendientes

- Decidir qué hacer con las colecciones de `src/content/` y la barra de avance, que ya no se muestran.
- Dominio propio (P-12).

Las decisiones y el backlog están en la bóveda de Obsidian, en
`DEV PERSONAL/Portafolio/01 Análisis de Requisitos/Reuniones`.
