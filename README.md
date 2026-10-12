# Portafolio — Jorge Retamal

Landing page de portafolio personal. Astro + Vercel, bilingüe ES/EN, tema Andrómeda.

## Correr el proyecto

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # genera dist/
npm run preview  # sirve dist/
npm run check    # tipos y accesibilidad
```

## Dónde está cada cosa

```
src/
  content/
    proyectos/es/      un .md por proyecto
    trayectoria/es/    un .md por etapa en Zweicom
    skills/es/         un .md por skill
  i18n/es.json         todos los textos de la interfaz
  site.ts              correo, GitHub, LinkedIn
  components/          Header, Hero, ProjectCard, Timeline, SectionHeading, Footer
  layouts/Base.astro   <head>, header y pie
  pages/
    index.astro        raíz: salta a /es/
    es/index.astro     la landing
  styles/global.css    tokens Andrómeda y utilidades
```

**Para agregar un proyecto** no hace falta tocar código: crea un `.md` en
`src/content/proyectos/es/` con este frontmatter.

```yaml
---
titulo: Nombre del proyecto
estado: idea | diseno | desarrollo | publicado
nota: meta 28 oct        # opcional
descripcion: Una o dos frases.
stack: [Astro, Supabase]
enlace: https://…        # opcional
repo: https://…          # opcional
orden: 4
---
```

El esquema de cada colección vive en `src/content.config.ts`; si un campo no
calza, el build falla y te dice cuál.

## Sistema visual

Tipografía **Iosevka** (OFL), autoalojada vía `@fontsource/iosevka`, pesos 400 y 700.

| Rol | Variable | Hex |
|---|---|---|
| Fondo | `--void` | `#0b0a14` |
| Tarjetas | `--nebula-dark` | `#14132a` |
| Texto | `--lavender` | `#e8e6f5` |
| Texto secundario | `--stardust` | `#9a97b8` |
| Acento principal | `--nebula` | `#8b7cf6` |
| Estados y fechas | `--star` | `#f2b66d` |
| Etiquetas de sección | `--aurora` | `#5ec8c0` |

## Idiomas

`astro.config.mjs` declara `es` (por defecto) y `en`, ambos con prefijo de ruta.
La raíz redirige a `/es/`: al instante en Vercel vía `vercel.json`, y con
`src/pages/index.astro` como respaldo en local.

El inglés llega en el Sprint 2 (P-08): hay que crear `src/i18n/en.json`,
apuntarlo en `src/i18n/index.ts`, duplicar el contenido en carpetas `en/` y
crear `src/pages/en/index.astro`. El selector de idioma del header aparece solo
cuando se le pasa `altLang`.

## Desplegar en Vercel

1. Sube el repo a GitHub.
2. En Vercel, importa el repo. Detecta Astro solo; no hay que configurar nada.
3. Define la variable de entorno `SITE_URL` con la URL final (la usa el sitemap
   y las URL canónicas).

## Pendientes

- Texto de la sección Servicio (P-06).
- Traducciones al inglés (P-08).
- GitHub y LinkedIn en `src/site.ts`.
- Niveles de skills (postergado en la Reunión 003).
- Dominio propio (P-12).

Las decisiones y el backlog están en la bóveda de Obsidian, en
`DEV PERSONAL/Portafolio/01 Análisis de Requisitos/Reuniones`.
