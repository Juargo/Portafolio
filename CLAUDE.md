# Portafolio — Contexto para Claude Code

## ¿Qué es este proyecto?

**Desde noviembre de 2026** es la página de servicios de **Jorge te lo resuelve**, el negocio de soluciones tecnológicas de Jorge Retamal, para casas y negocios. Es una sola página con seis servicios:

1. Instalación y configuración de redes
2. Soluciones de software (aplicaciones a la medida)
3. Soluciones de IA
4. Consultoría para adulto mayor
5. Instalación de cámaras
6. Configuración de domótica

Buena parte del público son **personas mayores del barrio**: el texto tiene que leerse fácil y el tono es cercano, sin jerga. La página no nombra la comuna ni dice "vecino"; la zona se indica al compartir el enlace.

La trayectoria en Zweicom ya no va en el sitio: va en el CV. Antes de noviembre el sitio era un portafolio de desarrollador freelance (secciones Ahora, Servicio, Trayectoria y Skills, tema Andrómeda con Iosevka); ese código está en el historial de git.

**Stack:** Astro + Vercel, sitio estático, bilingüe ES/EN.
**Diseño de referencia:** canvas "Web de servicios tecnológicos — propuestas" en Claude Design, opción **A · Cercano y claro**.
**Contacto:** WhatsApp (`wa.me`, con mensaje prellenado) y correo (`mailto:`). No hay formulario ni backend.
**Precio publicado:** diagnóstico $10.000, gratis si se aprueba el presupuesto.

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

**El contenido no se escribe en los componentes.** Los servicios, los pasos de "Cómo trabajo" y todos los textos viven en `src/i18n/es.json` y `en.json`; un servicio nuevo es un elemento más en `servicios.items` (su ícono se elige con `icono`, definido en `src/components/Servicios.astro`). Los datos de contacto viven en `src/site.ts`. Si estás por escribir una cadena en español dentro de un `.astro`, va en el JSON: de lo contrario el inglés queda sin traducir.

**Las secciones se declaran una sola vez.** `src/pages/[lang]/index.astro` (una sola página para los dos idiomas) tiene un arreglo `sections` que numera los encabezados y alimenta la navegación. Agregar una sección significa agregarla ahí; así nunca hay anclas muertas ni saltos de numeración.

**Nada confidencial de Zweicom.** Es una empresa privada. La trayectoria se cuenta por tipo de problema resuelto y tecnología usada, sin nombres de sistemas internos, clientes ni capturas.

**Sin texto de relleno.** Lo que falta se deja como marcador visible (`[texto del servicio]`), nunca lorem ipsum ni datos inventados.

**Accesibilidad como parte del trabajo, no como revisión posterior:** elementos reales (`<a>`, `<button>`), contraste ≥ 4.5:1, áreas táctiles ≥ 44px, sin desborde horizontal a 375px.

**`z` se importa desde `astro/zod`**, no desde `astro:content` (quedó obsoleto en Astro 7).

---

## Sistema visual

Estilo **"cercano y claro"**: fondo crema, tarjetas blancas y menta, un solo acento verde azulado, botones en forma de píldora y texto de 18 px como base. Los tokens de color están en `src/styles/global.css`.

Tipografías (ADR 0006): **Figtree** 700/800 para títulos y **Atkinson Hyperlegible** 400/700 para el texto, subconjunto latino de `@fontsource`, en `src/assets/fonts/`.

La foto de Jorge está en `src/assets/jorge.jpg` y se optimiza con `astro:assets` (requiere `sharp`).

**Imagen para compartir en redes** (`og:image`): `public/og/es.png` y `public/og/en.png`, de 1200×630, con la marca, el antetítulo, el título del hero y la foto. Si cambian esos textos, se regeneran con `node scripts/og-images.mjs` (requiere Google Chrome o `CHROME_PATH`).

---

## Idiomas

`astro.config.mjs` declara `es` (por defecto) y `en`, ambos con prefijo de ruta. La raíz redirige a `/es/`: en Vercel vía `vercel.json`, y con `src/pages/index.astro` como respaldo local.

**Los dos idiomas usan la misma página**, `src/pages/[lang]/index.astro`, que genera `/es/` y `/en/`. Los textos de interfaz están en `src/i18n/es.json` y `src/i18n/en.json`, que deben tener las mismas claves (`pnpm check` falla si falta una). El contenido se duplica en carpetas `es/` y `en/` de cada colección. **Todo cambio de texto se hace en los dos idiomas.**

---

## Estado actual

**Giro a servicios (18 nov 2026), rama `feat/web-servicios`.** La página quedó con Hero (foto, 14+ años, a domicilio, precio del diagnóstico), Servicios, Cómo trabajo y Contacto, en los dos idiomas. Se eliminaron los componentes de Ahora, Servicio, Trayectoria y Skills.

Quedan en el repositorio sin usarse en la página: las colecciones de `src/content/` (proyectos, trayectoria, skills), `src/lib/progress.ts` (barra de avance, ADR 0002/0005) y el workflow `daily-rebuild.yml`. Hay que decidir si se borran o se reutilizan.

**Pendiente de registrar:** el giro a servicios es una decisión de producto que aún no tiene acta en Obsidian (Reunión 011).

**Post-MVP:** P-12 (dominio propio).

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
