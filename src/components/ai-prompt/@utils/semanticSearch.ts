import { AI_CONSTANTS } from '../@const';
import type { RouteSemantic, SearchResult } from '../@interface/ai-engine.interface';

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
        score += AI_CONSTANTS.WEIGHTS.TAG_EXACT;
      }
      // Match parcial
      else if (queryTokens.some((qt) => tag.includes(qt) || qt.includes(tag))) {
        score += AI_CONSTANTS.WEIGHTS.TAG_PARTIAL;
      }
      // Similaridade de tokens
      else {
        score += this.jaccardSimilarity(tagTokens, queryTokens) * AI_CONSTANTS.WEIGHTS.TAG_SIMILARITY;
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
        score += AI_CONSTANTS.WEIGHTS.CAPABILITY_DIRECT;
      }

      // Similaridade de tokens
      const capTokens = this.tokenize(capability);
      score += this.jaccardSimilarity(capTokens, queryTokens) * AI_CONSTANTS.WEIGHTS.CAPABILITY_SIMILARITY;
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
    matchDetails.semantic = this.jaccardSimilarity(semanticTokens, queryTokens) * AI_CONSTANTS.WEIGHTS.SEMANTIC_BASE;

    // Bonus para match exato de frases
    if (this.containsMatch(route.semantic_text, query)) {
      matchDetails.semantic += AI_CONSTANTS.WEIGHTS.SEMANTIC_PHRASE_BONUS;
    }

    // 2. Score de tags (peso alto)
    matchDetails.tags = this.scoreTagMatch(indexed.normalizedTags, queryTokens);

    // 3. Score de capabilities (peso médio)
    matchDetails.capabilities = this.scoreCapabilityMatch(indexed.normalizedCapabilities, query, queryTokens);

    // 4. Score de título (peso médio-alto)
    const titleTokens = this.tokenize(route.title);
    matchDetails.title = this.jaccardSimilarity(titleTokens, queryTokens) * AI_CONSTANTS.WEIGHTS.TITLE_BASE;

    if (this.containsMatch(route.title, query)) {
      matchDetails.title += AI_CONSTANTS.WEIGHTS.TITLE_BONUS;
    }

    // 5. Score de path (peso baixo, mas útil)
    if (this.containsMatch(route.path, query)) {
      matchDetails.path = AI_CONSTANTS.WEIGHTS.PATH_MATCH;
    }

    // 6. Boost por prioridade
    const priorityBoost = (route.priority || 0) * AI_CONSTANTS.WEIGHTS.PRIORITY_BOOST;

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
  public search(query: string, limit: number = AI_CONSTANTS.DEFAULT_SEARCH_LIMIT): RouteSemantic[] {
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
      if (result.score > AI_CONSTANTS.MIN_SCORE_THRESHOLD) {
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
  public searchWithDetails(query: string, limit: number = AI_CONSTANTS.DEFAULT_SEARCH_LIMIT): SearchResult[] {
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

      if (result.score > AI_CONSTANTS.MIN_SCORE_THRESHOLD) {
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
