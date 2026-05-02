import { Locale } from '@prisma/client';

const LOCALE_VALUES = new Set<string>(Object.values(Locale));

/** Site default matches next-intl routing.defaultLocale */
export const DEFAULT_REQUEST_LOCALE = Locale.uk;

const FALLBACK_CHAIN: Locale[] = [Locale.uk, Locale.ru, Locale.en];

export function parseLocaleParam(raw?: string): Locale {
  if (!raw || typeof raw !== 'string') {
    return DEFAULT_REQUEST_LOCALE;
  }
  const normalized = raw.trim().toLowerCase();
  return LOCALE_VALUES.has(normalized)
    ? (normalized as Locale)
    : DEFAULT_REQUEST_LOCALE;
}

function dedupeLocales(order: Locale[]): Locale[] {
  const seen = new Set<Locale>();
  const out: Locale[] = [];
  for (const loc of order) {
    if (!seen.has(loc)) {
      seen.add(loc);
      out.push(loc);
    }
  }
  return out;
}

export type TranslationRow = {
  locale: Locale;
  title: string;
  description: string;
  titleSeo: string | null;
};

export type ResolvedProductCopy = {
  title: string;
  description: string;
  titleSeo?: string;
  localeApplied: Locale;
  translationFallback: boolean;
};

export function resolveLocalizedFields(
  translations: TranslationRow[],
  requested: Locale,
  legacyTitle: string,
  legacyDescription: string,
): ResolvedProductCopy {
  const byLocale = new Map(translations.map((t) => [t.locale, t]));
  const order = dedupeLocales([requested, ...FALLBACK_CHAIN]);

  for (const loc of order) {
    const row = byLocale.get(loc);
    if (
      row?.title?.trim().length &&
      row?.description?.trim().length
    ) {
      return {
        title: row.title,
        description: row.description,
        ...(row.titleSeo?.trim()
          ? { titleSeo: row.titleSeo.trim() }
          : {}),
        localeApplied: loc,
        translationFallback: loc !== requested,
      };
    }
  }

  for (const loc of order) {
    const row = byLocale.get(loc);
    if (row) {
      const title = row.title?.trim() ? row.title : legacyTitle;
      const description = row.description?.trim()
        ? row.description
        : legacyDescription;
      return {
        title,
        description,
        ...(row.titleSeo?.trim()
          ? { titleSeo: row.titleSeo.trim() }
          : {}),
        localeApplied: loc,
        translationFallback: loc !== requested,
      };
    }
  }

  return {
    title: legacyTitle,
    description: legacyDescription,
    localeApplied: requested,
    translationFallback: true,
  };
}
