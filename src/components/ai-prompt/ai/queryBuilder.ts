import {
  extractAbsoluteDates,
  extractBoolean,
  extractChartType,
  extractFilterType,
  extractInterval,
  extractMonthYear,
  extractPage,
  extractPeriodDays,
  extractPeriodHours,
  extractRelativeDates,
  extractSearch,
  extractSize,
  extractStatus,
  extractTimeRange,
  extractTravelType,
  extractUnit,
  extractViewType,
} from './extractors';
import type { RouteSemantic } from './types';

// Parameter type detection patterns
const PARAM_TYPES = {
  dateStart: ['datemin', 'datestart', 'dateinit', 'startdate', 'initialdate', 'min', 'timeinit'],
  dateEnd: ['datemax', 'dateend', 'enddate', 'finaldate', 'max', 'timeend'],
  date: ['date'],
  time: ['time', 'hora'],
  month: ['month', 'mes'],
  year: ['year', 'ano'],
  boolean: ['boolean', 'show', 'mostrar', 'is', 'exibir', 'incluir'],
  status: ['status', 'estado'],
  viewType: ['viewtype'],
  view: ['view', 'visualização'],
  travelType: ['traveltype', 'tipovigem'],
  chartType: ['charttype', 'tipografico'],
  filterType: ['filtertype'],
  unit: ['unit', 'unidade', 'medida'],
  page: ['page', 'pagina'],
  size: ['size', 'pagesize', 'tamanho'],
  interval: ['interval', 'intervalo'],
  period: ['period', 'periodo', 'days', 'dias'],
  periodHours: ['periodfilter', 'horas'],
  search: ['search', 'busca', 'pesquisa', 'termo'],
  machines: ['machines', 'embarcações', 'vessels', 'maquinas'],
} as const;

type ParamType = keyof typeof PARAM_TYPES;

export class QueryBuilder {
  /**
   * Attempts to extract query parameters from natural language query
   * using specialized extractors based on the parameter type defined in query_schema
   */
  public buildQueryParams(userInput: string, route: RouteSemantic): Record<string, string> {
    if (!route.query_schema) return {};

    const params: Record<string, string> = {};
    const processedTypes = new Set<string>();

    const absoluteDates = extractAbsoluteDates(userInput);
    const relativeDates = extractRelativeDates(userInput);
    const monthYear = extractMonthYear(userInput);
    const timeRange = extractTimeRange(userInput);

    const dates = {
      start: absoluteDates.start || relativeDates.start || monthYear.dateRange?.start,
      end: absoluteDates.end || relativeDates.end || monthYear.dateRange?.end,
    };

    for (const [key, description] of Object.entries(route.query_schema)) {
      if (key === 'idMachine') continue;

      const descStr = String(description).toLowerCase();
      const keyLower = key.toLowerCase();
      const paramType = this.detectParamType(keyLower, descStr);

      if (!paramType) continue;

      const value = this.extractValue(paramType, key, keyLower, userInput, {
        dates,
        timeRange,
        monthYear,
        processedTypes,
      });

      if (value !== undefined && value !== null && value !== '') {
        params[key] = String(value);
      }
    }

    return params;
  }

  /**
   * Detects the type of parameter based on its key and description
   */
  private detectParamType(keyLower: string, descStr: string): ParamType | null {
    for (const [type, patterns] of Object.entries(PARAM_TYPES)) {
      for (const pattern of patterns) {
        if (keyLower.includes(pattern)) {
          return type as ParamType;
        }
      }
    }

    for (const [type, patterns] of Object.entries(PARAM_TYPES)) {
      for (const pattern of patterns) {
        if (descStr.includes(pattern)) {
          return type as ParamType;
        }
      }
    }

    return null;
  }

  /**
   * Extracts value using the appropriate extractor based on param type
   */
  private extractValue(
    paramType: ParamType,
    key: string,
    keyLower: string,
    userInput: string,
    context: {
      dates: { start?: string; end?: string };
      timeRange: { start?: string; end?: string };
      monthYear: { month?: string; year?: string };
      processedTypes: Set<string>;
    },
  ): string | number | boolean | undefined {
    const { dates, timeRange, monthYear, processedTypes } = context;

    switch (paramType) {
      case 'dateStart':
        return dates.start;

      case 'dateEnd':
        return dates.end;

      case 'date':
        // Generic date - use start date
        if (!processedTypes.has('dateGeneric')) {
          processedTypes.add('dateGeneric');
          return dates.start;
        }
        return dates.end;

      case 'time':
        if (keyLower.includes('init') || keyLower.includes('start')) {
          return timeRange.start;
        }
        if (keyLower.includes('end')) {
          return timeRange.end;
        }
        return timeRange.start;

      case 'month':
        return monthYear.month;

      case 'year':
        return monthYear.year;

      case 'boolean':
        return extractBoolean(userInput, key)?.toString();

      case 'status':
        return extractStatus(userInput);

      case 'viewType':
        return extractViewType(userInput);

      // case 'view':
      //   return extractView(userInput);

      case 'travelType':
        return extractTravelType(userInput);

      case 'chartType':
        return extractChartType(userInput);

      case 'filterType':
        return extractFilterType(userInput);

      case 'unit':
        return extractUnit(userInput);

      case 'page':
        return extractPage(userInput);

      case 'size':
        return extractSize(userInput);

      case 'interval':
        return extractInterval(userInput);

      case 'period':
        return extractPeriodDays(userInput);

      case 'periodHours':
        return extractPeriodHours(userInput);

      case 'search':
        return extractSearch(userInput);

      // case 'machines':
      //   // Machine IDs would need a different approach - extract from context
      //   return undefined;

      default:
        return undefined;
    }
  }

  public toQueryString(params: Record<string, string>): string {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (key === 'idMachine') continue; // Garantia extra contra idMachine
      if (value !== undefined && value !== null && value !== '') {
        searchParams.set(key, value);
      }
    }
    const qs = searchParams.toString();
    return qs ? `?${qs}` : '';
  }
}
