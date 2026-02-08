import type { GraphResolver } from './graphResolver';
import type { SemanticSearch } from './semanticSearch';
import type { ContextOptions, RouteSemantic } from './types';

export class ContextBuilder {
  private semanticSearch: SemanticSearch;
  private graphResolver: GraphResolver;
  private cache: Map<string, string> = new Map();

  constructor(semanticSearch: SemanticSearch, graphResolver: GraphResolver) {
    this.semanticSearch = semanticSearch;
    this.graphResolver = graphResolver;
  }

  /**
   * Limpa o cache
   */
  public clearCache(): void {
    this.cache.clear();
  }

  /**
   * Builds a compact context string for the LLM based on the user query and current route.
   */
  public buildContext(query: string, currentRouteId?: string, options: ContextOptions = {}): string {
    const { maxRoutes = 10, includeGraphContext = true, semanticLimit = 8, verboseSchema = false } = options;

    const cacheKey = `${query}::${currentRouteId || ''}::${JSON.stringify(options)}`;
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // 1. Semantic Retrieval (Top N, aumentado para melhor cobertura)
    const semanticMatches = this.semanticSearch.search(query, semanticLimit);

    // 2. Graph Retrieval (If applicable)
    let graphMatches: RouteSemantic[] = [];
    if (currentRouteId && includeGraphContext) {
      const relatedNodes = this.graphResolver.getRelatedRoutes(currentRouteId);
      graphMatches = relatedNodes.map((node) => this.semanticSearch.findById(node.id)).filter((r): r is RouteSemantic => r !== null);
    }

    // 3. Merging and Prioritizing
    const seenIds = new Set<string>();
    const prioritizedMatches: Array<{ route: RouteSemantic; source: 'semantic' | 'graph' | 'current' }> = [];

    // Current route first (if provided)
    if (currentRouteId) {
      const currentRoute = this.semanticSearch.findById(currentRouteId);
      if (currentRoute) {
        prioritizedMatches.push({ route: currentRoute, source: 'current' });
        seenIds.add(currentRouteId);
      }
    }

    // Add semantic matches (they directly answer the query)
    for (const route of semanticMatches) {
      if (!seenIds.has(route.id)) {
        prioritizedMatches.push({ route, source: 'semantic' });
        seenIds.add(route.id);
      }
    }

    // Add graph matches (contextual information)
    for (const route of graphMatches) {
      if (!seenIds.has(route.id)) {
        prioritizedMatches.push({ route, source: 'graph' });
        seenIds.add(route.id);
      }
    }

    // Limit total context size
    const limitedMatches = prioritizedMatches.slice(0, maxRoutes);

    // 4. Formatting
    const sections: string[] = [];

    // Current route context (if exists)
    const currentMatches = limitedMatches.filter((m) => m.source === 'current');
    if (currentMatches.length > 0) {
      sections.push('=== CURRENT LOCATION ===');
      sections.push(
        this.formatRoutes(
          currentMatches.map((m) => m.route),
          verboseSchema,
        ),
      );
    }

    // Semantic matches (best matches for query)
    const semanticResults = limitedMatches.filter((m) => m.source === 'semantic');
    if (semanticResults.length > 0) {
      sections.push('=== RELEVANT ROUTES ===');
      sections.push(
        this.formatRoutes(
          semanticResults.map((m) => m.route),
          verboseSchema,
        ),
      );
    }

    // Graph context (related to current location)
    const graphResults = limitedMatches.filter((m) => m.source === 'graph');
    if (graphResults.length > 0) {
      sections.push('=== NEARBY/RELATED ROUTES ===');
      sections.push(
        this.formatRoutes(
          graphResults.map((m) => m.route),
          verboseSchema,
        ),
      );
    }

    const contextString = sections.join('\n\n');

    // Cache with size limit (prevent memory leak)
    if (this.cache.size > 100) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(cacheKey, contextString);
    return contextString;
  }

  /**
   * Formata uma lista de rotas para o contexto
   */
  private formatRoutes(routes: RouteSemantic[], verboseSchema: boolean): string {
    return routes
      .map((r, index) => {
        const parts: string[] = [];

        // Header
        parts.push(`${index + 1}. ${r.title} (${r.id})`);
        parts.push(`   Path: ${r.path}`);

        // Semantic text (principal descrição)
        if (r.semantic_text) {
          parts.push(`   Description: ${r.semantic_text}`);
        }

        // Capabilities (o que a rota permite fazer)
        if (r.capabilities && r.capabilities.length > 0) {
          parts.push(`   Can: ${r.capabilities.slice(0, 3).join(' | ')}`);
        }

        // Tags (keywords para matching)
        if (r.tags && r.tags.length > 0) {
          parts.push(`   Tags: ${r.tags.slice(0, 5).join(', ')}`);
        }

        // Entities (objetos relacionados)
        if (r.entities && r.entities.length > 0) {
          parts.push(`   Entities: ${r.entities.join(', ')}`);
        }

        // Query schema (apenas se verbose ou relevante)
        if (verboseSchema && r.query_schema) {
          parts.push(`   Params: ${JSON.stringify(r.query_schema)}`);
        }

        return parts.join('\n');
      })
      .join('\n\n');
  }

  /**
   * Busca contextual com debug info
   */
  public buildContextWithDebug(query: string, currentRouteId?: string, options: ContextOptions = {}): { context: string; debug: any } {
    const semanticLimit = options.semanticLimit || 8;

    // Usa versão com detalhes se disponível
    let semanticResults: any[] = [];
    if (typeof (this.semanticSearch as any).searchWithDetails === 'function') {
      semanticResults = (this.semanticSearch as any).searchWithDetails(query, semanticLimit);
    }

    const context = this.buildContext(query, currentRouteId, options);

    return {
      context,
      debug: {
        query,
        currentRouteId,
        options,
        semanticResults: semanticResults.map((r) => ({
          id: r.route.id,
          title: r.route.title,
          score: r.score,
          matchDetails: r.matchDetails,
        })),
      },
    };
  }
}
