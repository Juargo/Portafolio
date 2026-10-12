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

Las decisiones técnicas (arquitectura, herramientas) se registran como ADR en `doc/ADRs/`, dentro del repositorio.

El proyecto se lleva con **Agile**: cada tanda de trabajo se decide en una reunión y queda registrada ahí. Si tomas una decisión de producto nueva, pide que se registre; no la entierres en el código.

---

## Estructura

```
src/
  content/
    proyectos/es/      un .md por proyecto
    trayectoria/es/    un .md por etapa en Zweicom
    skills/es/         un .md por skill
  content.config.ts    esquema de las tres colecciones
  i18n/es.json         TODOS los textos de interfaz
  i18n/index.ts        useTranslations, mailtoHref, byLang
  site.ts              correo, GitHub, LinkedIn
  components/          Header, Hero, ProjectCard, Timeline, SectionHeading, Footer
  layouts/Base.astro   <head>, header, pie
  pages/index.astro    raíz: salta a /es/
  pages/es/index.astro la landing
  styles/global.css    tokens Andrómeda y utilidades
```

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

Tipografía **Iosevka** (OFL), autoalojada vía `@fontsource/iosevka`, pesos 400 y 700, monoespaciada en todo el sitio. Los tokens están en `src/styles/global.css`:

| Rol | Variable | Hex |
|---|---|---|
| Fondo | `--void` | `#0b0a14` |
| Tarjetas | `--nebula-dark` | `#14132a` |
| Texto | `--lavender` | `#e8e6f5` |
| Texto secundario | `--stardust` | `#9a97b8` |
| Acento principal | `--nebula` | `#8b7cf6` |
| Estados y fechas | `--star` | `#f2b66d` |
| Etiquetas de sección | `--aurora` | `#5ec8c0` |

Las apps de Jorge llevan nombres de estrellas de Andrómeda; de ahí el tema.

---

## Idiomas

`astro.config.mjs` declara `es` (por defecto) y `en`, ambos con prefijo de ruta. La raíz redirige a `/es/`: en Vercel vía `vercel.json`, y con `src/pages/index.astro` como respaldo local.

**El inglés aún no existe** (historia P-08). Para agregarlo: crear `src/i18n/en.json`, apuntarlo en el objeto `dictionaries` de `src/i18n/index.ts`, duplicar el contenido en carpetas `en/` y crear `src/pages/en/index.astro`. El selector del header aparece solo cuando se le pasa `altLang`.

---

## Estado actual

**Sprint 1 cerrado** (P-01 a P-05 y P-07): proyecto, tipografía y tokens, layout, hero, sección Ahora y Trayectoria. Compila sin errores.

**Sprint 2 pendiente:**

- **P-06** Sección Servicio y contacto — falta el texto, lo escribe Jorge.
- **P-08** Versión en inglés.
- **P-09** Repaso responsive.
- **P-10** SEO y rendimiento (Lighthouse ≥ 90).
- **P-11** Sección Skills. Los niveles y metas quedaron **postergados** (Reunión 003): los campos `nivelActual` y `nivelMeta` existen en el esquema pero son opcionales y hoy van vacíos.
- **P-12** Dominio propio (post-MVP).

**Otros pendientes:** subir el repositorio a GitHub y conectar Vercel; completar `github` y `linkedin` en `src/site.ts`; definir el nombre final de la app de finanzas.

**Punto de contenido abierto:** el título de la trayectoria dice "cuatro capas" pero la línea de tiempo muestra tres etapas. Hay que ajustar el título o nombrar las cuatro capas en la bajada.

---

## Comandos

```bash
pnpm install
pnpm dev          # http://localhost:4321
pnpm build        # genera dist/
pnpm preview      # sirve dist/
pnpm check        # tipos y accesibilidad; debe quedar en 0 errores
```

Antes de dar por terminado un cambio: `pnpm build` y `pnpm check` sin errores.
