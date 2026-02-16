/**
 * Specialized extractors for query parameter extraction from natural language.
 * All extractors return normalized English values suitable for URL parameters.
 */

import {
  BOOLEAN_FALSE_SYNONYMS,
  BOOLEAN_PARAM_KEYWORDS,
  BOOLEAN_TRUE_SYNONYMS,
  CHART_TYPE_SYNONYMS,
  FILTER_TYPE_SYNONYMS,
  INTERVAL_KEYWORDS,
  LAST_KEYWORDS,
  MONTH_NAMES,
  PAGE_KEYWORDS,
  PERIOD_KEYWORDS,
  PERIOD_NUMBER_KEYWORDS,
  RELATIVE_DATE_PATTERNS,
  SIZE_KEYWORDS,
  STATUS_SYNONYMS,
  TRAVEL_TYPE_SYNONYMS,
  UNIT_SYNONYMS,
  VIEW_SYNONYMS,
  VIEW_TYPE_SYNONYMS,
} from '../@const';
import type { DateRange, TimeRange } from '../@interface/ai-engine.interface';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Remove accents
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function findInSynonyms(input: string, synonymsMap: Record<string, string[]>): string | undefined {
  const normalized = normalizeText(input);
  for (const [key, synonyms] of Object.entries(synonymsMap)) {
    for (const synonym of synonyms) {
      if (normalized.includes(normalizeText(synonym))) {
        return key;
      }
    }
  }
  return undefined;
}

// ============================================================================
// DATE EXTRACTORS
// ============================================================================

/**
 * Extracts absolute dates in various formats:
 * - YYYY-MM-DD
 * - DD/MM/YYYY
 * - DD-MM-YYYY
 * - ISO 8601
 */
export function extractAbsoluteDates(input: string): DateRange {
  const result: DateRange = {};
  const dates: string[] = [];

  // ISO format: YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss
  const isoMatches = input.match(/\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2})?/g);
  if (isoMatches) {
    dates.push(...isoMatches.map((d) => d.split('T')[0]));
  }

  // DD/MM/YYYY, DD-MM-YYYY or DD MM YYYY
  const dmMatches = input.match(/(\d{1,2})[/\-\s](\d{1,2})[/\-\s](\d{4})/g);
  if (dmMatches) {
    for (const match of dmMatches) {
      const parts = match.split(/[/\-\s]/);
      if (parts.length === 3) {
        const [day, month, year] = parts;
        // Validate month and day to avoid false positives with other numbers
        const d = parseInt(day, 10);
        const m = parseInt(month, 10);
        if (m >= 1 && m <= 12 && d >= 1 && d <= 31) {
          const formatted = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
          if (!dates.includes(formatted)) {
            dates.push(formatted);
          }
        }
      }
    }
  }

  // YYYY MM DD or YYYY-MM-DD (already covered by ISO but adding space support)
  const ymdMatches = input.match(/(\d{4})[/\-\s](\d{1,2})[/\-\s](\d{1,2})/g);
  if (ymdMatches) {
    for (const match of ymdMatches) {
      const parts = match.split(/[/\-\s]/);
      if (parts.length === 3) {
        const [year, month, day] = parts;
        const d = parseInt(day, 10);
        const m = parseInt(month, 10);
        if (m >= 1 && m <= 12 && d >= 1 && d <= 31) {
          const formatted = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
          if (!dates.includes(formatted)) {
            dates.push(formatted);
          }
        }
      }
    }
  }

  if (dates.length > 0) {
    result.start = dates[0];
    result.end = dates[1] || dates[0];
  }

  return result;
}

/**
 * Extracts relative dates like "ontem", "última semana", "últimos 7 dias"
 */
export function extractRelativeDates(input: string): DateRange {
  const normalized = normalizeText(input);
  const now = new Date();
  const result: DateRange = {};

  // Check simple patterns (hoje, ontem, ayer, yesterday, etc.)
  for (const [keyword, resolver] of Object.entries(RELATIVE_DATE_PATTERNS)) {
    if (normalized.includes(normalizeText(keyword))) {
      const { start, end } = resolver(now);
      return { start: formatDate(start), end: formatDate(end) };
    }
  }

  // Check "últimos X dias/semanas/meses" pattern
  const lastKeywordsPattern = LAST_KEYWORDS.map((k) => normalizeText(k)).join('|');
  const daysPattern = PERIOD_KEYWORDS.days.map((k) => normalizeText(k)).join('|');
  const weeksPattern = PERIOD_KEYWORDS.weeks.map((k) => normalizeText(k)).join('|');
  const monthsPattern = PERIOD_KEYWORDS.months.map((k) => normalizeText(k)).join('|');

  // Match "últimos 7 dias", "last 30 days", etc.
  const lastDaysMatch = normalized.match(new RegExp(`(?:${lastKeywordsPattern})\\s*(\\d+)\\s*(?:${daysPattern})`));
  if (lastDaysMatch) {
    const days = parseInt(lastDaysMatch[1], 10);
    const start = new Date(now);
    start.setDate(start.getDate() - days);
    return { start: formatDate(start), end: formatDate(now) };
  }

  // Match "últimas 2 semanas", "last 2 weeks", etc.
  const lastWeeksMatch = normalized.match(new RegExp(`(?:${lastKeywordsPattern})\\s*(\\d+)\\s*(?:${weeksPattern})`));
  if (lastWeeksMatch) {
    const weeks = parseInt(lastWeeksMatch[1], 10);
    const start = new Date(now);
    start.setDate(start.getDate() - weeks * 7);
    return { start: formatDate(start), end: formatDate(now) };
  }

  // Match "últimos 3 meses", "last 3 months", etc.
  const lastMonthsMatch = normalized.match(new RegExp(`(?:${lastKeywordsPattern})\\s*(\\d+)\\s*(?:${monthsPattern})`));
  if (lastMonthsMatch) {
    const months = parseInt(lastMonthsMatch[1], 10);
    const start = new Date(now);
    start.setMonth(start.getMonth() - months);
    return { start: formatDate(start), end: formatDate(now) };
  }

  return result;
}

/**
 * Extracts month and year from input like "janeiro 2025", "january 2025", "01/2025"
 */
export function extractMonthYear(input: string): { month?: string; year?: string; dateRange?: DateRange } {
  const normalized = normalizeText(input);
  const result: { month?: string; year?: string; dateRange?: DateRange } = {};

  // Try to find month name
  for (const [monthName, monthNum] of Object.entries(MONTH_NAMES)) {
    if (normalized.includes(normalizeText(monthName))) {
      // Look for year near the month
      const yearMatch = input.match(/\b(20\d{2})\b/);
      const year = yearMatch ? parseInt(yearMatch[1], 10) : new Date().getFullYear();

      result.month = `${year}-${String(monthNum).padStart(2, '0')}`;
      result.year = String(year);

      // Also compute date range for this month
      const firstDay = new Date(year, monthNum - 1, 1);
      const lastDay = new Date(year, monthNum, 0);
      result.dateRange = {
        start: formatDate(firstDay),
        end: formatDate(lastDay),
      };

      return result;
    }
  }

  // Try MM/YYYY format
  const mmYearMatch = input.match(/(\d{1,2})[/-](20\d{2})/);
  if (mmYearMatch) {
    const month = parseInt(mmYearMatch[1], 10);
    const year = parseInt(mmYearMatch[2], 10);
    if (month >= 1 && month <= 12) {
      result.month = `${year}-${String(month).padStart(2, '0')}`;
      result.year = String(year);

      const firstDay = new Date(year, month - 1, 1);
      const lastDay = new Date(year, month, 0);
      result.dateRange = {
        start: formatDate(firstDay),
        end: formatDate(lastDay),
      };
    }
  }

  // Just year
  const yearOnlyMatch = input.match(/\b(20\d{2})\b/);
  if (yearOnlyMatch && !result.year) {
    result.year = yearOnlyMatch[1];
  }

  return result;
}

// ============================================================================
// TIME EXTRACTORS
// ============================================================================

/**
 * Extracts time ranges like "das 08:00 às 17:00", "from 8am to 5pm"
 */
export function extractTimeRange(input: string): TimeRange {
  const result: TimeRange = {};

  // HH:mm format
  const timeMatches = input.match(/\d{1,2}:\d{2}/g);
  if (timeMatches && timeMatches.length >= 1) {
    result.start = timeMatches[0].padStart(5, '0');
    if (timeMatches.length >= 2) {
      result.end = timeMatches[1].padStart(5, '0');
    }
    return result;
  }

  // AM/PM format
  const ampmMatches = input.match(/(\d{1,2})\s*(am|pm)/gi);
  if (ampmMatches) {
    const times: string[] = [];
    for (const match of ampmMatches) {
      const hourMatch = match.match(/(\d{1,2})\s*(am|pm)/i);
      if (hourMatch) {
        let hour = parseInt(hourMatch[1], 10);
        const isPM = hourMatch[2].toLowerCase() === 'pm';
        if (isPM && hour !== 12) hour += 12;
        if (!isPM && hour === 12) hour = 0;
        times.push(`${String(hour).padStart(2, '0')}:00`);
      }
    }
    if (times.length >= 1) {
      result.start = times[0];
      if (times.length >= 2) {
        result.end = times[1];
      }
    }
  }

  return result;
}

// ============================================================================
// BOOLEAN EXTRACTOR
// ============================================================================

/**
 * Extracts boolean values for specific parameter keys
 */
export function extractBoolean(input: string, paramKey: string): boolean | undefined {
  const normalized = normalizeText(input);

  // Check if this parameter's keywords are mentioned
  const paramKeywords = BOOLEAN_PARAM_KEYWORDS[paramKey];
  if (paramKeywords) {
    const hasParamMention = paramKeywords.some((kw) => normalized.includes(normalizeText(kw)));
    if (!hasParamMention) {
      return undefined; // This parameter is not mentioned in input
    }
  }

  // Check for explicit true/false
  for (const trueSyn of BOOLEAN_TRUE_SYNONYMS) {
    if (normalized.includes(normalizeText(trueSyn))) {
      return true;
    }
  }

  for (const falseSyn of BOOLEAN_FALSE_SYNONYMS) {
    if (normalized.includes(normalizeText(falseSyn))) {
      return false;
    }
  }

  // If parameter is mentioned but no explicit value, default to true (e.g., "mostrar desabilitados")
  if (paramKeywords) {
    return true;
  }

  return undefined;
}

// ============================================================================
// STATUS/TYPE EXTRACTORS
// ============================================================================

/**
 * Extracts status values from input
 */
export function extractStatus(input: string): string | undefined {
  return findInSynonyms(input, STATUS_SYNONYMS);
}

/**
 * Extracts view type (consumption/stock)
 */
export function extractViewType(input: string): string | undefined {
  return findInSynonyms(input, VIEW_TYPE_SYNONYMS);
}

/**
 * Extracts view (operational/financial)
 */
export function extractView(input: string): string | undefined {
  return findInSynonyms(input, VIEW_SYNONYMS);
}

/**
 * Extracts travel type
 */
export function extractTravelType(input: string): string | undefined {
  return findInSynonyms(input, TRAVEL_TYPE_SYNONYMS);
}

/**
 * Extracts chart type
 */
export function extractChartType(input: string): string | undefined {
  return findInSynonyms(input, CHART_TYPE_SYNONYMS);
}

/**
 * Extracts filter type (range/month)
 */
export function extractFilterType(input: string): string | undefined {
  return findInSynonyms(input, FILTER_TYPE_SYNONYMS);
}

// ============================================================================
// UNIT EXTRACTOR
// ============================================================================

/**
 * Extracts unit of measurement
 */
export function extractUnit(input: string): string | undefined {
  return findInSynonyms(input, UNIT_SYNONYMS);
}

// ============================================================================
// NUMBER EXTRACTORS
// ============================================================================

/**
 * Extracts page number
 */
export function extractPage(input: string): number | undefined {
  const normalized = normalizeText(input);

  for (const keyword of PAGE_KEYWORDS) {
    const pattern = new RegExp(`${normalizeText(keyword)}\\s*(\\d+)`, 'i');
    const match = normalized.match(pattern);
    if (match) {
      return parseInt(match[1], 10);
    }
  }

  return undefined;
}

/**
 * Extracts page size
 */
export function extractSize(input: string): number | undefined {
  const normalized = normalizeText(input);

  // Pattern: "20 por página", "50 items per page"
  const beforePattern = /(\d+)\s*(?:itens|items|registros|records|resultados|results)/i;
  const match = normalized.match(beforePattern);
  if (match) {
    return parseInt(match[1], 10);
  }

  // Pattern with keywords
  for (const keyword of SIZE_KEYWORDS) {
    const pattern = new RegExp(`(\\d+)\\s*${normalizeText(keyword)}`, 'i');
    const kwMatch = normalized.match(pattern);
    if (kwMatch) {
      return parseInt(kwMatch[1], 10);
    }
  }

  return undefined;
}

/**
 * Extracts interval in minutes
 */
export function extractInterval(input: string): number | undefined {
  const normalized = normalizeText(input);

  for (const keyword of INTERVAL_KEYWORDS) {
    const pattern = new RegExp(`${normalizeText(keyword)}\\s*(\\d+)\\s*(?:min|minutos?|minutes?)`, 'i');
    const match = normalized.match(pattern);
    if (match) {
      return parseInt(match[1], 10);
    }
  }

  // Also try "30 minutos" without keyword
  const simpleMatch = normalized.match(/(\d+)\s*(?:min|minutos?|minutes?)/);
  if (simpleMatch) {
    return parseInt(simpleMatch[1], 10);
  }

  return undefined;
}

/**
 * Extracts period in days
 */
export function extractPeriodDays(input: string): number | undefined {
  const normalized = normalizeText(input);

  // "período de 30 dias", "period of 30 days"
  for (const keyword of PERIOD_NUMBER_KEYWORDS) {
    const daysPattern = PERIOD_KEYWORDS.days.map((k) => normalizeText(k)).join('|');
    const pattern = new RegExp(`${normalizeText(keyword)}[^\\d]*(\\d+)\\s*(?:${daysPattern})`, 'i');
    const match = normalized.match(pattern);
    if (match) {
      return parseInt(match[1], 10);
    }
  }

  return undefined;
}

/**
 * Extracts period in hours
 */
export function extractPeriodHours(input: string): number | undefined {
  const normalized = normalizeText(input);

  const hoursPattern = PERIOD_KEYWORDS.hours.map((k) => normalizeText(k)).join('|');
  const pattern = new RegExp(`(\\d+)\\s*(?:${hoursPattern})`, 'i');
  const match = normalized.match(pattern);
  if (match) {
    return parseInt(match[1], 10);
  }

  return undefined;
}

// ============================================================================
// SEARCH EXTRACTOR
// ============================================================================

/**
 * Extracts search terms - this is used as a fallback for remaining text
 * after other extractions have been made.
 */
export function extractSearch(input: string): string | undefined {
  // Remove common noise words and extract meaningful search terms
  const noisePatterns = [
    /\b(?:mostrar|show|exibir|display|ver|view|ir para|go to|navegar|navigate)\b/gi,
    /\b(?:página|page|com|with|de|of|para|for|em|in|no|na|nos|nas)\b/gi,
    /\d{4}-\d{2}-\d{2}/g, // Dates
    /\d{1,2}:\d{2}/g, // Times
    /\d+/g, // Numbers
  ];

  let cleaned = input;
  for (const pattern of noisePatterns) {
    cleaned = cleaned.replace(pattern, ' ');
  }

  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  return cleaned.length > 2 ? cleaned : undefined;
}
