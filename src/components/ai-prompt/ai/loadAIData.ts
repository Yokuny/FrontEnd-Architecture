import type { RouteGraph, RouteIndex, RouteSemantic } from './types';

// #1 puxa os arquivos de public/ai gerado por `pnpm run routes:ai`
export async function loadAIData() {
  const [indexResponse, graphResponse, semanticResponse] = await Promise.all([fetch('/ai/routes.index.json'), fetch('/ai/routes.graph.json'), fetch('/ai/routes.semantic.jsonl')]);

  const index = (await indexResponse.json()) as { routes: RouteIndex[] };
  const graph = (await graphResponse.json()) as RouteGraph;
  const semanticText = await semanticResponse.text();

  const semantic = semanticText
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map((line) => JSON.parse(line) as RouteSemantic);

  return {
    index: index.routes,
    graph,
    semantic,
  };
}
