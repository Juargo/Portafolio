/**
 * Datos del sitio. WhatsApp y correo son los canales de contacto; GitHub y
 * LinkedIn aparecen en el pie y uno vacío no se muestra.
 */
export const site = {
  author: 'Jorge Retamal',
  brand: 'Jorge te lo resuelve',
  email: 'jorgeretamalaburto@gmail.com',
  /** Número de WhatsApp en formato internacional, sin "+" ni espacios (para wa.me). */
  whatsapp: '56945581138',
  /** El mismo número, como se muestra en pantalla. */
  whatsappDisplay: '+56 9 4558 1138',
  github: 'https://github.com/Juargo',
  linkedin: 'https://www.linkedin.com/in/jorge-retamal-aburto-a9552060/',
} as const;

export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];

/** Código de idioma por locale, para `hreflang` y el sitemap. */
export const hreflang: Record<Locale, string> = { es: 'es-CL', en: 'en' };
