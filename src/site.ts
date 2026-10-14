/**
 * Datos del sitio. Los enlaces de correo, GitHub y LinkedIn aparecen solos en el pie; uno vacío no se muestra.
 */
export const site = {
  author: 'Jorge Retamal',
  email: 'jorgeretamalaburto@gmail.com',
  github: 'https://github.com/Juargo',
  linkedin: 'https://www.linkedin.com/in/jorge-retamal-aburto-a9552060/',
} as const;

export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];

/** Código de idioma por locale, para `hreflang` y el sitemap. */
export const hreflang: Record<Locale, string> = { es: 'es-CL', en: 'en' };
