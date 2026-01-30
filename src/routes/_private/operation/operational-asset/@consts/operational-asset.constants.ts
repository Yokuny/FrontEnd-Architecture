export const OPERATIONAL_ASSET_STATUS = {
  OPERACAO: 'operacao',
  DOWNTIME: 'downtime',
  DOWNTIME_PARCIAL: 'downtime-parcial',
  PARADA_PROGRAMADA: 'parada-programada',
  DOCKAGE: 'dockage',
} as const;

export const STATUS_COLORS: Record<string, string> = {
  [OPERATIONAL_ASSET_STATUS.OPERACAO]: '#10b981', // green-500
  [OPERATIONAL_ASSET_STATUS.DOWNTIME]: '#ef4444', // red-500
  [OPERATIONAL_ASSET_STATUS.DOWNTIME_PARCIAL]: '#f59e0b', // amber-500
  [OPERATIONAL_ASSET_STATUS.PARADA_PROGRAMADA]: '#3b82f6', // blue-500
  [OPERATIONAL_ASSET_STATUS.DOCKAGE]: '#8b5cf6', // violet-500
};

export const OPERATIONAL_ASSET_VIEW = {
  OPERATIONAL: 'OPERATIONAL',
  FINANCIAL: 'FINANCIAL',
} as const;

export const DATE_FORMATS = {
  ISO: 'yyyy-MM-dd',
  DISPLAY: 'dd MM yyyy',
  CHART_DAY: 'dd/MM',
  TIME: 'HH:mm',
  FILENAME: 'yyyyMMddHHmmss',
};

export const DEFAULT_FILTER_DAYS = 30;

export const FILENAME_PREFIX = 'operational_asset_';

export const CURRENCY_CONFIG = {
  LOCALE: 'pt-BR',
  CODE: 'BRL',
};

export const CHART_MIN_HEIGHT = {
  DEFAULT: '300px',
  LARGE: '400px',
};
