import { ContextBuilder } from './contextBuilder';
import { GraphResolver } from './graphResolver';
import { QueryBuilder } from './queryBuilder';
import { SemanticSearch } from './semanticSearch';
import type { RouteGraph, RouteIndex, RouteSemantic } from './types';

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
    const results = this.semanticSearch.searchWithDetails(userInput, 4);

    return results.map((result) => {
      const match = result.route;
      // TODO: Montar a query com IA ?
      const params = this.queryBuilder.buildQueryParams(userInput, match);
      // const queryString = this.queryBuilder.toQueryString(params);

      const indexEntry = this.routeIndex.find((r) => r.id === match.id);
      const rawPath = indexEntry?.path || match.path;
      const path = this.cleanPath(rawPath);

      return {
        route: match,
        path,
        params,
        fullUrl: path,
        // fullUrl: `${path}${queryString}`,
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

export interface NavigationResult {
  route: RouteSemantic;
  path: string;
  params: Record<string, string>;
  fullUrl: string;
  confidence: number;
}
