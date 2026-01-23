import { enUS, es, ptBR } from 'date-fns/locale';
import type { Locale } from '@/hooks/use-locale';

export const localeMap = {
  en: enUS,
  es: es,
  pt: ptBR,
};

export const getDateLocale = (locale: Locale) => {
  return localeMap[locale] || enUS;
};
