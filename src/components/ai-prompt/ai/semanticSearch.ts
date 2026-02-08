import type { RouteSemantic, SearchResult } from './types';

export class SemanticSearch {
  private routes: RouteSemantic[] = [];
  private indexedData: Map<
    string,
    {
      route: RouteSemantic;
      normalizedText: string;
      normalizedTags: string[];
      normalizedCapabilities: string[];
    }
  > = new Map();

  constructor(routes: RouteSemantic[]) {
    this.routes = routes;
    this.buildIndex();
  }

  /**
   * Normaliza texto removendo acentos, convertendo para minúsculas e removendo caracteres especiais
   */
  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^\w\s]/g, ' ') // Remove pontuação
      .replace(/\s+/g, ' ') // Normaliza espaços
      .trim();
  }

  /**
   * Extrai tokens (palavras) de um texto normalizado
   */
  private tokenize(text: string): string[] {
    return this.normalizeText(text)
      .split(' ')
      .filter((token) => token.length > 2); // Remove palavras muito curtas
  }

  /**
   * Constrói índice invertido para busca rápida
   */
  private buildIndex(): void {
    for (const route of this.routes) {
      const normalizedText = this.normalizeText(`${route.semantic_text} ${route.title} ${route.path}`);

      const normalizedTags = (route.tags || []).map((tag) => this.normalizeText(tag));

      const normalizedCapabilities = (route.capabilities || []).map((cap) => this.normalizeText(cap));

      this.indexedData.set(route.id, {
        route,
        normalizedText,
        normalizedTags,
        normalizedCapabilities,
      });
    }
  }

  /**
   * Calcula similaridade usando Jaccard Index (tokens em comum)
   */
  private jaccardSimilarity(tokens1: string[], tokens2: string[]): number {
    const set1 = new Set(tokens1);
    const set2 = new Set(tokens2);

    const intersection = new Set([...set1].filter((x) => set2.has(x)));
    const union = new Set([...set1, ...set2]);

    return union.size === 0 ? 0 : intersection.size / union.size;
  }

  /**
   * Verifica se uma string contém uma substring (normalizada)
   */
  private containsMatch(text: string, query: string): boolean {
    return this.normalizeText(text).includes(this.normalizeText(query));
  }

  /**
   * Calcula score de correspondência exata ou parcial em tags
   */
  private scoreTagMatch(tags: string[], queryTokens: string[]): number {
    let score = 0;

    for (const tag of tags) {
      const tagTokens = this.tokenize(tag);

      // Match exato de tag vale mais
      if (queryTokens.some((qt) => tag === qt)) {
        score += 2.0;
      }
      // Match parcial
      else if (queryTokens.some((qt) => tag.includes(qt) || qt.includes(tag))) {
        score += 1.0;
      }
      // Similaridade de tokens
      else {
        score += this.jaccardSimilarity(tagTokens, queryTokens) * 0.5;
      }
    }

    return score;
  }

  /**
   * Calcula score de correspondência em capabilities
   */
  private scoreCapabilityMatch(capabilities: string[], query: string, queryTokens: string[]): number {
    let score = 0;

    for (const capability of capabilities) {
      // Match direto na capability
      if (this.containsMatch(capability, query)) {
        score += 1.5;
      }

      // Similaridade de tokens
      const capTokens = this.tokenize(capability);
      score += this.jaccardSimilarity(capTokens, queryTokens) * 0.8;
    }

    return score;
  }

  /**
   * Calcula score total de uma rota para uma query
   */
  private scoreRoute(
    route: RouteSemantic,
    indexed: {
      normalizedText: string;
      normalizedTags: string[];
      normalizedCapabilities: string[];
    },
    query: string,
    queryTokens: string[],
  ): SearchResult {
    const matchDetails = {
      semantic: 0,
      tags: 0,
      capabilities: 0,
      title: 0,
      path: 0,
    };

    // 1. Score de semantic_text (peso maior)
    const semanticTokens = this.tokenize(indexed.normalizedText);
    matchDetails.semantic = this.jaccardSimilarity(semanticTokens, queryTokens) * 5.0;

    // Bonus para match exato de frases
    if (this.containsMatch(route.semantic_text, query)) {
      matchDetails.semantic += 3.0;
    }

    // 2. Score de tags (peso alto)
    matchDetails.tags = this.scoreTagMatch(indexed.normalizedTags, queryTokens);

    // 3. Score de capabilities (peso médio)
    matchDetails.capabilities = this.scoreCapabilityMatch(indexed.normalizedCapabilities, query, queryTokens);

    // 4. Score de título (peso médio-alto)
    const titleTokens = this.tokenize(route.title);
    matchDetails.title = this.jaccardSimilarity(titleTokens, queryTokens) * 3.0;

    if (this.containsMatch(route.title, query)) {
      matchDetails.title += 2.0;
    }

    // 5. Score de path (peso baixo, mas útil)
    if (this.containsMatch(route.path, query)) {
      matchDetails.path = 1.0;
    }

    // 6. Boost por prioridade
    const priorityBoost = (route.priority || 0) * 0.5;

    const totalScore = matchDetails.semantic + matchDetails.tags + matchDetails.capabilities + matchDetails.title + matchDetails.path + priorityBoost;

    return {
      route,
      score: totalScore,
      matchDetails,
    };
  }

  /**
   * Busca semântica principal
   */
  public search(query: string, limit: number = 5): RouteSemantic[] {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const queryTokens = this.tokenize(query);

    if (queryTokens.length === 0) {
      return [];
    }

    const results: SearchResult[] = [];

    // Score cada rota
    for (const [, indexed] of this.indexedData.entries()) {
      const result = this.scoreRoute(indexed.route, indexed, query, queryTokens);

      // Apenas inclui resultados com score mínimo
      if (result.score > 0.1) {
        results.push(result);
      }
    }

    // Ordena por score (maior primeiro)
    results.sort((a, b) => b.score - a.score);

    // Retorna top N
    return results.slice(0, limit).map((r) => r.route);
  }

  /**
   * Busca com detalhes de scoring (útil para debugging)
   */
  public searchWithDetails(query: string, limit: number = 5): SearchResult[] {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const queryTokens = this.tokenize(query);

    if (queryTokens.length === 0) {
      return [];
    }

    const results: SearchResult[] = [];

    for (const [, indexed] of this.indexedData.entries()) {
      const result = this.scoreRoute(indexed.route, indexed, query, queryTokens);

      if (result.score > 0.1) {
        results.push(result);
      }
    }

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, limit);
  }

  /**
   * Busca por ID
   */
  public findById(id: string): RouteSemantic | null {
    const indexed = this.indexedData.get(id);
    return indexed ? indexed.route : null;
  }

  /**
   * Retorna todas as rotas
   */
  public getAllRoutes(): RouteSemantic[] {
    return this.routes;
  }
}
