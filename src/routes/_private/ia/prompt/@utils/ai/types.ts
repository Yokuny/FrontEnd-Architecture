export interface RouteIndex {
  id: string;
  path: string;
  title: string;
  embeddingKey: string;
}

export interface RouteNode {
  id: string;
  type: string;
  label: string;
  // properties for context builder
  parent_id?: string;
  children?: string[];
  metadata?: Record<string, any>;
}

export interface RouteEdge {
  from: string;
  to: string;
  relation: string;
  description: string;
}

export interface RouteGraph {
  nodes: RouteNode[];
  edges: RouteEdge[];
}

export interface RouteSemantic {
  id: string;
  path: string;
  title: string;
  semantic_text: string;
  capabilities?: string[];
  tags?: string[];
  entities?: string[];
  priority?: number;
  query_schema?: Record<string, any>;
  parent_id?: string;
  children?: string[];
}

export interface SearchResult {
  route: RouteSemantic;
  score: number;
  matchDetails: {
    semantic: number;
    tags: number;
    capabilities: number;
    title: number;
    path: number;
  };
}

export interface ContextOptions {
  maxRoutes?: number;
  includeGraphContext?: boolean;
  semanticLimit?: number;
  verboseSchema?: boolean;
}

export interface DebugInfo {
  query: string;
  currentRouteId?: string;
  options: ContextOptions;
  semanticResults: Array<{
    id: string;
    title: string;
    score: number;
    matchDetails: {
      semantic: number;
      tags: number;
      capabilities: number;
      title: number;
      path: number;
    };
  }>;
}
