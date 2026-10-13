# ADR 0003 — Recortar Iosevka a los caracteres del sitio

- **Estado:** Aceptada
- **Fecha:** 2026-10-13

## Contexto

La tipografía se cargaba desde `@fontsource/iosevka` con los archivos `latin-400` y `latin-700`. Aun siendo el subconjunto "latin", cada peso pesa cerca de 1 MB en woff2, porque Iosevka trae miles de glifos y variantes. En Lighthouse (móvil, 4G simulado) el rendimiento daba 51: primer pintado a 11,1 s y un desplazamiento de diseño de 0,127 al llegar la fuente. P-10 exige rendimiento ≥ 90.

## Decisión

La fuente se **recorta** con `pyftsubset` (fonttools) a los caracteres que usa el sitio y se versiona en `src/assets/fonts/`. El script `scripts/subset-fonts.sh` la regenera a partir de `@fontsource/iosevka`. El `@font-face` vive en `src/styles/global.css` y `Base.astro` precarga los dos pesos.

El rango incluye latín básico, Latín-1 (tildes, ñ, ¿, ©, ·), guiones, comillas tipográficas, viñeta, elipsis y →.

## Motivos

- Cada peso baja de ~1 MB a 23 KB. Con la precarga, Lighthouse da 100 en rendimiento, accesibilidad, buenas prácticas y SEO, en móvil y en escritorio.
- Se conserva el sistema visual de la Reunión 003; cambiar de fuente no hacía falta.
- El recorte se versiona en vez de generarse al compilar, para que el build de Vercel no dependa de Python ni de fonttools.

## Consecuencias

- Un carácter fuera del rango se muestra con la fuente de respaldo (`ui-monospace`). Si el contenido suma uno, se agrega a `UNICODES` en el script y se vuelve a ejecutar.
- Regenerar la fuente requiere fonttools (`brew install fonttools`).
- `@fontsource/iosevka` queda solo como origen de los archivos para el script; el sitio ya no lo importa.
