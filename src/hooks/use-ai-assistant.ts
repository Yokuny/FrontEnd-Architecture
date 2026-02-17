import { useEffect, useMemo, useState } from 'react';
import type { RouteGraph, RouteIndex, RouteSemantic } from '@/components/ai-prompt/@interface/ai-engine.interface';
import type { NavigationResult } from '@/components/ai-prompt/@interface/ai-prompt.interface';
import { NavigationAgent } from '@/components/ai-prompt/@utils/navigationAgent';

async function loadAIData() {
  const [indexResponse, graphResponse, semanticResponse] = await Promise.all([fetch('/ai/routes.index.json'), fetch('/ai/routes.graph.json'), fetch('/ai/routes.semantic.jsonl')]);

  const index = (await indexResponse.json()) as { routes: RouteIndex[] };
  const graph = (await graphResponse.json()) as RouteGraph;
  const semanticText = await semanticResponse.text();

  const semantic = semanticText
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map((line) => JSON.parse(line) as RouteSemantic);

  return { index: index.routes, graph, semantic };
}

export function useAIAssistant() {
  const [data, setData] = useState<{
    index: RouteIndex[];
    graph: RouteGraph;
    semantic: RouteSemantic[];
  } | null>(null);

  useEffect(() => {
    loadAIData()
      .then((loadedData) => {
        setData(loadedData);
      })
      .catch((_e) => {});
  }, []);

  const agent = useMemo(() => {
    if (!data) return null;
    return new NavigationAgent(data.index, data.graph, data.semantic);
  }, [data]);

  const ask = async (query: string): Promise<NavigationResult[]> => {
    if (!agent) return [];
    return agent.processQuery(query);
  };

  return { ask, agent };
}
