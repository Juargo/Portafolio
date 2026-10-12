import es from './es.json';
import type { Locale } from '../site';
import { site } from '../site';

const dictionaries = { es, en: es } as const; // `en` se reemplaza en el Sprint 2 (P-08)

export type Dictionary = typeof es;

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
