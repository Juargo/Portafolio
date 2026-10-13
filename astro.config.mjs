import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { hreflang } from './src/site.ts';

// Cambia SITE cuando tengas el dominio definitivo (P-12).
const SITE = process.env.SITE_URL ?? 'https://portafolio-umber-gamma-88.vercel.app';

export default defineConfig({
  site: SITE,
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
