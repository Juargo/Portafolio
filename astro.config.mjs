import { defineConfig, envField } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { hreflang } from './src/site.ts';

// Cambia SITE cuando tengas el dominio definitivo (P-12).
const SITE = process.env.SITE_URL ?? 'https://portafolio-umber-gamma-88.vercel.app';

export default defineConfig({
  site: SITE,
  env: {
    schema: {
      // Token de GitHub de solo lectura para la barra de avance (ADR 0002).
      // Opcional: sin él, la API se consulta sin autenticar.
      GH_PROGRESS_TOKEN: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
  i18n: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
    routing: {
      prefixDefaultLocale: true,
      // La raíz la maneja src/pages/index.astro (y vercel.json en producción),
      // para que el salto a /es/ sea inmediato y no con 2 s de espera.
      redirectToDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      // La raíz solo redirige a /es/ (y lleva noindex): no se indexa.
      filter: (page) => new URL(page).pathname !== '/',
      i18n: { defaultLocale: 'es', locales: hreflang },
    }),
  ],
});
