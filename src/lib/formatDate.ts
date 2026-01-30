import { formatDistanceToNow as dateFnsFormatDistanceToNow, type FormatDistanceToNowOptions, type FormatOptions, format, isValid } from 'date-fns';
import { enUS, es, ptBR } from 'date-fns/locale';
import { useLocale } from '@/hooks/use-locale';

/**
 * Map of application locales to date-fns locale objects.
 */
export const localeMap = {
  en: enUS,
  es: es,
  pt: ptBR,
};

/**
 * Returns the current date-fns locale object based on the application state.
 *
 * @param locale - Optional locale key to get a specific locale object
 * @returns The date-fns locale object
 */
export function getDateLocale(locale?: keyof typeof localeMap): any {
  const targetLocale = locale || useLocale.getState().locale;
  return localeMap[targetLocale] || enUS;
}

/**
 * Formats a date using the current system locale from the useLocale store.
 *
 * @param date - The date to format (Date object, timestamp, or ISO string)
 * @param formatStr - The format pattern (Standard date-fns patterns)
 * @param fallback - String to return if the date is invalid (default: '')
 * @param options - Optional date-fns format options (e.g. weekStartsOn)
 * @returns The formatted date string, or the fallback string if the date is invalid.
 *
 * @example
 * formatDate(new Date(), 'PP') // "25 de jan. de 2026" (if pt)
 * formatDate(null, 'PP', '-') // "-"
 */
export function formatDate(date: Date | string | number | null | undefined, formatStr: string, fallback = '', options?: FormatOptions): string {
  if (!date) return fallback;

  const d = new Date(date);
  if (!isValid(d)) {
    return fallback;
  }

  const locale = getDateLocale();

  return format(d, formatStr, {
    locale,
    ...options,
  });
}

/**
 * Formats the distance to now using the current system locale.
 *
 * @param date - The date to compare with now
 * @param options - Optional date-fns formatDistanceToNow options
 * @returns The localized distance string
 */
export function formatDistanceToNow(date: Date | string | number, options?: FormatDistanceToNowOptions): string {
  const d = new Date(date);
  if (!isValid(d)) return '';

  const locale = getDateLocale();

  return dateFnsFormatDistanceToNow(d, {
    locale,
    ...options,
  });
}
