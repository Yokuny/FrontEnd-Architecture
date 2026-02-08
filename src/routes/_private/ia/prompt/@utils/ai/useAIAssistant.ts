import { useLocation } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { LLMService } from './LLMService';
import { loadAIData } from './loadAIData';
import { NavigationAgent, type NavigationResult } from './navigationAgent';
import type { RouteGraph, RouteIndex, RouteSemantic } from './types';

export function useAIAssistant() {
  const location = useLocation();

  const [data, setData] = useState<{
    index: RouteIndex[];
    graph: RouteGraph;
    semantic: RouteSemantic[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // #1 puxa os arquivos de public/ai gerado por `pnpm run routes:ai`
    loadAIData()
      .then((loadedData) => {
        setData(loadedData);
        setIsLoading(false);
      })
      .catch((_e) => {
        setIsLoading(false);
      });
  }, []);

  const agent = useMemo(() => {
    if (!data) return null;
    return new NavigationAgent(data.index, data.graph, data.semantic);
  }, [data]);

  const llm = useMemo(() => new LLMService(), []);

  const ask = async (query: string): Promise<NavigationResult[]> => {
    // #2 recebe a pergunta e processa a busca
    if (!agent) return [];
    return agent.processQuery(query);
  };

  const explain = async (query: string): Promise<string> => {
    // #3
    if (!data || !agent) return 'Dados ainda carregando...';

    // Auto-detect current route ID based on location
    const currentPath = location.pathname;
    const currentRouteId = data.index.find((r) => r.path === currentPath)?.id;
    // Build the RAG context locally using the agent's context builder
    const context = agent.buildContext(query, currentRouteId);
    try {
      return await llm.chat(query, context);
    } catch {
      return '';
    }
  };

  return {
    ask,
    explain,
    isLoading,
    agent,
  };
}
