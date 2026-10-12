import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Cambia SITE cuando tengas el dominio definitivo (P-12).
const SITE = process.env.SITE_URL ?? 'https://portafolio.vercel.app';

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
  integrations: [sitemap({ i18n: { defaultLocale: 'es', locales: { es: 'es-CL', en: 'en' } } })],
});
