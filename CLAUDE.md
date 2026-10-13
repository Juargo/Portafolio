# Portafolio — Contexto para Claude Code

## ¿Qué es este proyecto?

Landing page de portafolio personal de Jorge Retamal. Su objetivo doble:

1. **Conseguir clientes freelance.** Esa es la audiencia principal, no reclutadores. El servicio que se ofrece es uno solo: **desarrollo full stack**.
2. **Servir de guía propia** sobre los proyectos y skills que tiene y los que quiere mejorar.

El relato central es una carrera de **14 años en una sola empresa (Zweicom, 2012–2026)**, contada como capas de responsabilidad que se suman —soporte, QA, DevOps, desarrollo— y no como empleos sueltos.

**Stack:** Astro + Vercel, sitio estático, bilingüe ES/EN.
**Referencia de estructura:** https://pasho.dev/ (página lineal, sin menú, fondo oscuro).
**Contacto:** solo correo (`mailto:`). No hay formulario ni backend, y el MVP no los lleva.

---

## Dónde viven las decisiones

Las actas de reunión están en la bóveda de Obsidian, **fuera de este repositorio**:

`~/Library/Mobile Documents/iCloud~md~obsidian/Documents/JJ - Developer/0002 EL YO CREADOR/DEV PERSONAL/Portafolio/01 Análisis de Requisitos/Reuniones`

- **Reunión 001** — visión, audiencia, idioma, cómo contar la trayectoria.
- **Reunión 002** — alcance: proyectos públicos, Zweicom descriptivo, Astro + Vercel, meta ≈ 24 oct 2026.
- **Reunión 003** — sistema visual: tema Andrómeda e Iosevka.
- **Reunión 004** — backlog (P-01 … P-12), plan de 2 sprints, riesgos.
- **Reunión 005** — cierre del Sprint 1.
- **Reunión 006** — barra de avance de proyectos (P-13): milestone de GitHub por proyecto, calculado al compilar (ADR 0002).
- **Reunión 007** — planificación del Sprint 2: alcance, prioridad y orden de recorte, texto aprobado del servicio y bajada de la trayectoria.

Las decisiones técnicas (arquitectura, herramientas) se registran como ADR en `doc/ADRs/`, dentro del repositorio.

El proyecto se lleva con **Agile**: cada tanda de trabajo se decide en una reunión y queda registrada ahí. Si tomas una decisión de producto nueva, pide que se registre; no la entierres en el código.

---

## Reglas del proyecto

**El contenido no se escribe en los componentes.** Un proyecto, una etapa de la trayectoria o una skill se agregan creando un `.md` en `src/content/`. Un texto de interfaz se agrega a `src/i18n/es.json`. Si estás por escribir una cadena en español dentro de un `.astro`, va en el JSON: de lo contrario el inglés queda sin traducir.

**Las secciones se declaran una sola vez.** `src/pages/es/index.astro` tiene un arreglo `sections` que numera los encabezados y alimenta la navegación. Agregar una sección significa agregarla ahí; así nunca hay anclas muertas ni saltos de numeración.

**Nada confidencial de Zweicom.** Es una empresa privada. La trayectoria se cuenta por tipo de problema resuelto y tecnología usada, sin nombres de sistemas internos, clientes ni capturas.

**Sin texto de relleno.** Lo que falta se deja como marcador visible (`[texto del servicio]`), nunca lorem ipsum ni datos inventados.

**Accesibilidad como parte del trabajo, no como revisión posterior:** elementos reales (`<a>`, `<button>`), contraste ≥ 4.5:1, áreas táctiles ≥ 44px, sin desborde horizontal a 375px.

**`z` se importa desde `astro/zod`**, no desde `astro:content` (quedó obsoleto en Astro 7).

---

## Sistema visual

Tipografía **Iosevka** (OFL), pesos 400 y 700, monoespaciada en todo el sitio. Va recortada a los caracteres que usa el sitio (ADR 0003): si el contenido suma un carácter nuevo, se agrega en `scripts/subset-fonts.sh` y se vuelve a ejecutar. Los tokens de color están en `src/styles/global.css`.

Las apps de Jorge llevan nombres de estrellas de Andrómeda; de ahí el tema.

---

## Idiomas

`astro.config.mjs` declara `es` (por defecto) y `en`, ambos con prefijo de ruta. La raíz redirige a `/es/`: en Vercel vía `vercel.json`, y con `src/pages/index.astro` como respaldo local.

**El inglés aún no existe** (historia P-08). Para agregarlo: crear `src/i18n/en.json`, apuntarlo en el objeto `dictionaries` de `src/i18n/index.ts`, duplicar el contenido en carpetas `en/` y crear `src/pages/en/index.astro`. El selector del header aparece solo cuando se le pasa `altLang`.

---

## Estado actual

**Sprint 1 cerrado** (P-01 a P-05 y P-07): proyecto, tipografía y tokens, layout, hero, sección Ahora y Trayectoria. Compila sin errores.

**Sprint 2 en curso** (13 al 24 oct, 22 pts, Reunión 007). En orden de prioridad; si no alcanza el tiempo, se recorta desde abajo:

1. **P-06** Sección Servicio y contacto. El texto está aprobado en la Reunión 007 y se copia tal cual.
2. **P-09** Repaso responsive.
3. **P-10** SEO y rendimiento (Lighthouse ≥ 90).
4. **P-13** Barra de avance por proyecto (Reunión 006, ADR 0002). Criterios de aceptación en la Reunión 007.
5. **P-11** Sección Skills. Los niveles y metas quedaron **postergados** (Reunión 003): los campos `nivelActual` y `nivelMeta` existen en el esquema pero son opcionales y hoy van vacíos.
6. **P-08** Versión en inglés. Se traduce al final, con los textos en español cerrados.

El MVP mínimo del sprint es P-06, P-09 y P-10.

**Post-MVP:** **P-12** Dominio propio.

**Otros pendientes:** completar `github` y `linkedin` en `src/site.ts`; definir el nombre final de la app de finanzas; preparar los repositorios de proyectos para P-13 (públicos, con milestone, y `repo`/`milestone` en cada `.md`).

**Bajada de la trayectoria (decidida, falta aplicarla):** el título "14 años, una empresa, cuatro capas" se mantiene y la bajada nombra las cuatro capas: "Zweicom · 2012 – 2026. Soporte, QA, DevOps y desarrollo: cada etapa sumó una capa que hoy uso al desarrollar."

---

## Despliegue

- **Repositorio:** https://github.com/Juargo/Portafolio
- **Vercel:** proyecto `portafolio` en el equipo `juargos-projects`, conectado al repositorio. Producción: https://portafolio-umber-gamma-88.vercel.app (subdominio provisional hasta P-12).
- **Rama de producción:** `main`. Cada merge a `main` despliega a producción; cada PR y cada rama generan un deploy de preview.
- **Preset de framework:** `"framework": "astro"` en `vercel.json`. Vercel no detectó Astro al crear el proyecto y lo dejó en "Other", que publica `public/` en vez de `dist/`; no hay que quitarlo.
- **Versión de pnpm:** el proyecto tiene la variable `ENABLE_EXPERIMENTAL_COREPACK=1` en Production, Preview y Development. Con ella, Vercel usa la versión de `packageManager` en `package.json`; sin ella, elige pnpm 9 o 10 según el lockfile (ver ADR 0001).

---

## Antes de cerrar un cambio

Antes de dar por terminado un cambio: `pnpm build` y `pnpm check` sin errores.
