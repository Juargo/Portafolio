import es from './es.json';
import en from './en.json';
import type { Locale } from '../site';
import { site } from '../site';

export type Dictionary = typeof es;

/** `en.json` debe tener las mismas claves que `es.json`; si falta una, `pnpm check` falla. */
const dictionaries: Record<Locale, Dictionary> = { es, en };

export function useTranslations(lang: Locale): Dictionary {
  return dictionaries[lang] ?? es;
}

/** Enlace de correo con asunto y saludo prellenados. */
export function mailtoHref(lang: Locale): string {
  const t = useTranslations(lang);
  const params = new URLSearchParams({
    subject: t.mailto.subject,
    body: `${t.mailto.body}\n\n`,
  });
  return `mailto:${site.email}?${params.toString()}`;
}

/** Filtra una colección por el idioma, según la subcarpeta del archivo. */
export function byLang<T extends { id: string }>(entries: T[], lang: Locale): T[] {
  return entries.filter((entry) => entry.id.startsWith(`${lang}/`));
}
