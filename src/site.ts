/**
 * Datos del sitio. Completa los campos vacíos y aparecen solos en el pie.
 */
export const site = {
  author: 'Jorge Retamal',
  email: 'jorgeretamalaburto@gmail.com',
  // Pendientes de contenido (Reunión 004): pega las URL y se renderizan.
  github: '',
  linkedin: '',
} as const;

export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];

/** Código de idioma por locale, para `hreflang` y el sitemap. */
export const hreflang: Record<Locale, string> = { es: 'es-CL', en: 'en' };
