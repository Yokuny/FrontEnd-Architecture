import { AI_CONSTANTS } from '../@const';
import type { RouteGraph, RouteIndex, RouteSemantic } from '../@interface/ai-engine.interface';
import type { NavigationResult } from '../@interface/ai-prompt.interface';
import { ContextBuilder } from './contextBuilder';
import { GraphResolver } from './graphResolver';
import { QueryBuilder } from './queryBuilder';
import { SemanticSearch } from './semanticSearch';

export class NavigationAgent {
  public semanticSearch: SemanticSearch;
  public graphResolver: GraphResolver;
  private queryBuilder: QueryBuilder;
  private contextBuilder: ContextBuilder;
  private routeIndex: RouteIndex[];

  constructor(index: RouteIndex[], graph: RouteGraph, semantic: RouteSemantic[]) {
    this.routeIndex = index;
    this.semanticSearch = new SemanticSearch(semantic);
    this.graphResolver = new GraphResolver(graph);
    this.queryBuilder = new QueryBuilder();
    this.contextBuilder = new ContextBuilder(this.semanticSearch, this.graphResolver);
  }

  private cleanPath(path: string): string {
    // Limpa o segmento _private do tanstack router
    return (
      path
        .split('/')
        .filter((segment) => !segment.startsWith('_'))
        .join('/') || '/'
    );
  }

  // #2 recebe a pergunta e processa a busca
  public async processQuery(userInput: string): Promise<NavigationResult[]> {
    const results = this.semanticSearch.searchWithDetails(userInput, AI_CONSTANTS.NAVIGATION_SEARCH_LIMIT);

    return results.map((result) => {
      const params = this.queryBuilder.buildQueryParams(userInput, result.route);
      const queryString = this.queryBuilder.toQueryString(params);

      const indexEntry = this.routeIndex.find((r) => r.id === result.route.id);
      const rawPath = indexEntry?.path || result.route.path;
      const path = this.cleanPath(rawPath);

      return {
        route: result.route,
        path,
        params,
        fullUrl: `${path}${queryString}`,
        confidence: result.score,
      };
    });
  }

  public getRelated(routeId: string) {
    return this.graphResolver.getRelatedRoutes(routeId);
  }

  public buildContext(query: string, currentRouteId?: string): string {
    return this.contextBuilder.buildContext(query, currentRouteId);
  }
}
