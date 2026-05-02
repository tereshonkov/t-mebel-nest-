import { Locale } from '@prisma/client';
import {
  parseLocaleParam,
  resolveLocalizedFields,
  type TranslationRow,
} from './product-locale';

describe('product-locale', () => {
  describe('parseLocaleParam', () => {
    it('defaults invalid to uk', () => {
      expect(parseLocaleParam('xx')).toBe(Locale.uk);
      expect(parseLocaleParam()).toBe(Locale.uk);
    });

    it('accepts uk ru en case-insensitively', () => {
      expect(parseLocaleParam('RU')).toBe(Locale.ru);
      expect(parseLocaleParam('En')).toBe(Locale.en);
    });
  });

  describe('resolveLocalizedFields', () => {
    const legacy = { title: 'L', description: 'D' };

    it('uses exact locale when complete', () => {
      const rows: TranslationRow[] = [
        {
          locale: Locale.uk,
          title: 'Укр',
          description: 'Текст',
          titleSeo: 'SEO',
        },
        {
          locale: Locale.ru,
          title: 'Ru',
          description: 'Ru d',
          titleSeo: null,
        },
      ];
      const r = resolveLocalizedFields(rows, Locale.uk, legacy.title, legacy.description);
      expect(r.title).toBe('Укр');
      expect(r.description).toBe('Текст');
      expect(r.titleSeo).toBe('SEO');
      expect(r.localeApplied).toBe(Locale.uk);
      expect(r.translationFallback).toBe(false);
    });

    it('falls back along uk ru en when requested missing', () => {
      const rows: TranslationRow[] = [
        {
          locale: Locale.ru,
          title: 'Ru',
          description: 'Rd',
          titleSeo: null,
        },
      ];
      const r = resolveLocalizedFields(rows, Locale.uk, legacy.title, legacy.description);
      expect(r.localeApplied).toBe(Locale.ru);
      expect(r.translationFallback).toBe(true);
      expect(r.title).toBe('Ru');
    });

    it('uses legacy when no translations', () => {
      const r = resolveLocalizedFields([], Locale.en, legacy.title, legacy.description);
      expect(r.title).toBe('L');
      expect(r.description).toBe('D');
      expect(r.localeApplied).toBe(Locale.en);
      expect(r.translationFallback).toBe(true);
    });
  });
});
