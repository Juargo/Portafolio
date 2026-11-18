# ADR 0006 — Figtree y Atkinson Hyperlegible en lugar de Iosevka

- **Estado:** Aceptada
- **Fecha:** 2026-11-18
- **Reemplaza a:** ADR 0003

## Contexto

En noviembre de 2026 el sitio deja de ser un portafolio de trayectoria y pasa a ser la página de servicios de **Jorge te lo resuelve**: redes, cámaras, domótica, software, IA y consultoría para adulto mayor. Jorge eligió el estilo "cercano y claro", con fondo crema y acento verde azulado. Buena parte del público son personas mayores, así que lo primero es que el texto se lea fácil. Una monoespaciada como Iosevka transmite "desarrollador", pero cuesta más leerla en párrafos largos.

## Decisión

- **Títulos:** Figtree, pesos 700 y 800.
- **Texto:** Atkinson Hyperlegible, pesos 400 y 700. Está diseñada para lectores con baja visión y distingue bien letras parecidas (I, l, 1; O, 0).
- Se usan los archivos `latin` de `@fontsource/figtree` y `@fontsource/atkinson-hyperlegible`, copiados a `src/assets/fonts/`. El `@font-face` vive en `src/styles/global.css`, y `Base.astro` precarga Atkinson 400 y Figtree 800.
- Ya no hace falta recortarlas: cada archivo pesa entre 15 y 30 KB. Se eliminan `scripts/subset-fonts.sh`, los archivos de Iosevka y la dependencia `@fontsource/iosevka`.

## Consecuencias

- El subconjunto `latin` cubre el español (á, é, ñ, ¿, ¡). Si algún día se usa un carácter fuera de ese rango, se agrega el archivo `latin-ext` del mismo paquete.
- Atkinson dibuja el cero con una barra (0). Es parte de su legibilidad, no un error.
- `scripts/og-images.mjs` usa Figtree y la foto de `src/assets/jorge.jpg`.
