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
- **Reunión 008** — cierre del Sprint 2 (MVP completo) y alcance del Sprint 3 de pulido.
- **Reunión 009** — cierre del Sprint 3 y alcance del Sprint 4 de contenido (niveles de skills y capturas).
- **Reunión 010** — avance por todos los milestones de cada repositorio (ADR 0005) y metas de skills en texto en vez de niveles.

Las decisiones técnicas (arquitectura, herramientas) se registran como ADR en `doc/ADRs/`, dentro del repositorio.

El proyecto se lleva con **Agile**: cada tanda de trabajo se decide en una reunión y queda registrada ahí. Si tomas una decisión de producto nueva, pide que se registre; no la entierres en el código.

---

## Reglas del proyecto

**El contenido no se escribe en los componentes.** Un proyecto, una etapa de la trayectoria o una skill se agregan creando un `.md` en `src/content/`. Un texto de interfaz se agrega a `src/i18n/es.json`. Si estás por escribir una cadena en español dentro de un `.astro`, va en el JSON: de lo contrario el inglés queda sin traducir.

**Las secciones se declaran una sola vez.** `src/pages/[lang]/index.astro` (una sola página para los dos idiomas) tiene un arreglo `sections` que numera los encabezados y alimenta la navegación. Agregar una sección significa agregarla ahí; así nunca hay anclas muertas ni saltos de numeración.

**Nada confidencial de Zweicom.** Es una empresa privada. La trayectoria se cuenta por tipo de problema resuelto y tecnología usada, sin nombres de sistemas internos, clientes ni capturas.

**Sin texto de relleno.** Lo que falta se deja como marcador visible (`[texto del servicio]`), nunca lorem ipsum ni datos inventados.

**Accesibilidad como parte del trabajo, no como revisión posterior:** elementos reales (`<a>`, `<button>`), contraste ≥ 4.5:1, áreas táctiles ≥ 44px, sin desborde horizontal a 375px.

**`z` se importa desde `astro/zod`**, no desde `astro:content` (quedó obsoleto en Astro 7).

---

## Sistema visual

Tipografía **Iosevka** (OFL), pesos 400 y 700, monoespaciada en todo el sitio. Va recortada a los caracteres que usa el sitio (ADR 0003): si el contenido suma un carácter nuevo, se agrega en `scripts/subset-fonts.sh` y se vuelve a ejecutar. Los tokens de color están en `src/styles/global.css`.

**Imagen para compartir en redes** (`og:image`): `public/og/es.png` y `public/og/en.png`, de 1200×630, con la marca, el antetítulo y el título del hero. Si cambian esos textos, se regeneran con `node scripts/og-images.mjs` (requiere Google Chrome).

Las apps de Jorge llevan nombres de estrellas de Andrómeda; de ahí el tema.

---

## Idiomas

`astro.config.mjs` declara `es` (por defecto) y `en`, ambos con prefijo de ruta. La raíz redirige a `/es/`: en Vercel vía `vercel.json`, y con `src/pages/index.astro` como respaldo local.

**Los dos idiomas usan la misma página**, `src/pages/[lang]/index.astro`, que genera `/es/` y `/en/`. Los textos de interfaz están en `src/i18n/es.json` y `src/i18n/en.json`, que deben tener las mismas claves (`pnpm check` falla si falta una). El contenido se duplica en carpetas `es/` y `en/` de cada colección. **Todo cambio de texto se hace en los dos idiomas.**

---

## Estado actual

**Sprint 1 cerrado** (P-01 a P-05 y P-07): proyecto, tipografía y tokens, layout, hero, sección Ahora y Trayectoria. Compila sin errores.

**Sprint 2 cerrado** (22 de 22 pts, Reunión 008): servicio y contacto, responsive, SEO y rendimiento (Lighthouse 100), barra de avance, Skills y versión en inglés. **El MVP está completo.**

**Sprint 3 cerrado** (5 de 5 pts, Reunión 009): asunto del correo en el pie, imagen para compartir en redes, enlaces de GitHub y LinkedIn, y el nombre de la app de finanzas (**Mirach**).

**Sprint 4 en curso: contenido** (15 al 28 oct, 8 pts, Reuniones 009 y 010). Excepción explícita a la regla del post-MVP:

1. **P-20** Avance por todos los milestones de cada repositorio (Reunión 010, ADR 0005). Hecho en código; las barras aparecen cuando los repos tengan milestones con issues.
2. **P-18** Metas de skills **en texto, sin escala numérica** (Reunión 010): una línea "hacia dónde voy" por skill, en los dos idiomas. Reemplaza a `nivelActual` y `nivelMeta`. Depende de que Jorge escriba las metas.
3. **P-19** Capturas de proyectos: una imagen opcional por proyecto, optimizada y con texto alternativo en los dos idiomas. Depende de que Jorge entregue las capturas; un proyecto sin captura se publica sin imagen.

**Configuración pendiente de P-13** (solo Jorge): `GH_PROGRESS_TOKEN` en Vercel, `VERCEL_DEPLOY_HOOK` en GitHub, y milestones con issues en los repos de Acrux y Mirach (el `repo` ya está cargado). Ver Despliegue.

**Post-MVP:** P-12 (dominio propio), notas o blog.

---

## Despliegue

- **Repositorio:** https://github.com/Juargo/Portafolio
- **Vercel:** proyecto `portafolio` en el equipo `juargos-projects`, conectado al repositorio. Producción: https://portafolio-umber-gamma-88.vercel.app (subdominio provisional hasta P-12).
- **Rama de producción:** `main`. Cada merge a `main` despliega a producción; cada PR y cada rama generan un deploy de preview.
- **Preset de framework:** `"framework": "astro"` en `vercel.json`. Vercel no detectó Astro al crear el proyecto y lo dejó en "Other", que publica `public/` en vez de `dist/`; no hay que quitarlo.
- **Barra de avance (P-13, ADR 0002):**
  - `GH_PROGRESS_TOKEN`: variable de entorno en Vercel (Production y Preview) con un fine-grained token de solo lectura (Issues y Metadata). Es opcional: sin ella, la API se consulta sin autenticar.
  - `VERCEL_DEPLOY_HOOK`: secreto del repositorio en GitHub con la URL del deploy hook de Vercel (rama `main`). Lo usa `.github/workflows/daily-rebuild.yml`, que recompila el sitio cada día a las 09:00 UTC y se puede disparar a mano.
  - Para que un proyecto muestre barras, su `.md` necesita `repo` (repositorio público). La tarjeta muestra una barra por cada milestone del repositorio que tenga issues, ordenadas por fecha límite (ADR 0005). Si algo falla, el build lo informa con `[avance]` y el proyecto se publica sin barras.
- **Versión de pnpm:** el proyecto tiene la variable `ENABLE_EXPERIMENTAL_COREPACK=1` en Production, Preview y Development. Con ella, Vercel usa la versión de `packageManager` en `package.json`; sin ella, elige pnpm 9 o 10 según el lockfile (ver ADR 0001).

---

## Antes de cerrar un cambio

Antes de dar por terminado un cambio: `pnpm build`, `pnpm check` y `pnpm test` sin errores (ADR 0004).
