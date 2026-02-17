/**
 * Tipos de gráfico suportados pelo frontend
 */
export type ChartType = 'bar' | 'line' | 'pie' | 'doughnut' | 'area' | 'scatter' | 'radar' | 'gauge' | 'table' | 'kpi';

/**
 * Configuração de um dataset para o gráfico
 */
export interface IChartDataset {
  label: string;
  data: number[];
  color?: string;
}

/**
 * Configuração de visualização (gráfico) para renderização no front-end
 */
export interface IVisualization {
  /** Tipo do gráfico que o front-end deve renderizar */
  chartType: ChartType;
  /** Título do gráfico */
  title: string;
  /** Labels do eixo X ou categorias */
  labels: string[];
  /** Datasets com os dados numéricos */
  datasets: IChartDataset[];
  /** Opções extras de configuração */
  options?: {
    xAxisLabel?: string;
    yAxisLabel?: string;
    stacked?: boolean;
    showLegend?: boolean;
    unit?: string;
  };
}

/**
 * Um insight individual com nível de importância
 */
export interface IInsight {
  text: string;
  type: 'info' | 'warning' | 'success' | 'critical';
  metric?: {
    label: string;
    value: number | string;
    unit?: string;
    trend?: 'up' | 'down' | 'stable';
    changePercent?: number;
  };
}

/**
 * Resposta interpretada pela IA com suporte a visualizações
 */
export interface IInterpretedResponse {
  answer: string;
  summary: {
    totalRecords: number;
    recordsReturned: number;
    hasMore: boolean;
  };
  /** Formato de resposta preferido */
  responseFormat: 'insights' | 'table' | 'chart' | 'mixed';
  /** Dados brutos (opcionais, para formato table/json) */
  data?: any[];
  /** Insights gerados pela IA com contexto e métricas */
  insights: IInsight[];
  /** Visualizações prontas para renderização em gráficos */
  visualizations: IVisualization[];
  /** KPIs/Cards de destaque */
  kpis?: {
    label: string;
    value: number | string;
    unit?: string;
    icon?: string;
    trend?: 'up' | 'down' | 'stable';
    changePercent?: number;
  }[];
  metadata: {
    confidence: number;
    dataQuality: 'complete' | 'partial' | 'empty';
    suggestedActions: string[];
  };
}
