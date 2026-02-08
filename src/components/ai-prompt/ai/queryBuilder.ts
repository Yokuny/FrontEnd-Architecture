import type { RouteSemantic } from './types';

export class QueryBuilder {
  /**
   * Attempts to extract query parameters from natural language query
   */
  public buildQueryParams(userInput: string, route: RouteSemantic): Record<string, string> {
    // TODO: Esse trecho montar com IA
    if (!route.query_schema) return {};

    const params: Record<string, string> = {};
    const lowerInput = userInput.toLowerCase();

    for (const [key, description] of Object.entries(route.query_schema)) {
      const descStr = String(description).toLowerCase();

      // Simple dates
      if (descStr.includes('date')) {
        const dateMatch = lowerInput.match(/\d{4}-\d{2}-\d{2}/g);
        if (dateMatch) {
          if (key.toLowerCase().includes('min') || key.toLowerCase().includes('start')) {
            params[key] = dateMatch[0];
          } else if (key.toLowerCase().includes('max') || key.toLowerCase().includes('end')) {
            params[key] = dateMatch[1] || dateMatch[0];
          } else if (!params[key]) {
            params[key] = dateMatch[0];
          }
        }
      }

      // Simple IDs or numbers
      if (descStr.includes('id') || descStr.includes('number')) {
        const idMatch = lowerInput.match(/(?:id|#)\s*(\w+)/) || lowerInput.match(/(\d+)/);
        if (idMatch) {
          params[key] = idMatch[1];
        }
      }
    }

    return params;
  }

  public toQueryString(params: Record<string, string>): string {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      searchParams.set(key, value);
    }
    const qs = searchParams.toString();
    return qs ? `?${qs}` : '';
  }
}
