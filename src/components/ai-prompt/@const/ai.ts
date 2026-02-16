export const AI_CONSTANTS = {
  // Search Settings
  NAVIGATION_SEARCH_LIMIT: 3,
  DEFAULT_SEARCH_LIMIT: 5,
  MIN_SCORE_THRESHOLD: 0.1,

  // Scoring Weights
  WEIGHTS: {
    SEMANTIC_BASE: 5.0,
    SEMANTIC_PHRASE_BONUS: 3.0,
    TAG_EXACT: 2.0,
    TAG_PARTIAL: 1.0,
    TAG_SIMILARITY: 0.5,
    CAPABILITY_DIRECT: 1.5,
    CAPABILITY_SIMILARITY: 0.8,
    TITLE_BASE: 3.0,
    TITLE_BONUS: 2.0,
    PATH_MATCH: 1.0,
    PRIORITY_BOOST: 0.5,
  },

  // Context Building
  CONTEXT: {
    MAX_ROUTES: 10,
    SEMANTIC_LIMIT: 8,
    CACHE_SIZE_LIMIT: 100,
    SECTIONS: {
      CURRENT: '=== CURRENT LOCATION ===',
      RELEVANT: '=== RELEVANT ROUTES ===',
      RELATED: '=== NEARBY/RELATED ROUTES ===',
    },
  },

  // Parameter detection patterns
  PARAM_TYPES: {
    dateStart: ['datemin', 'datestart', 'dateinit', 'startdate', 'initialdate', 'min', 'timeinit'],
    dateEnd: ['datemax', 'dateend', 'enddate', 'finaldate', 'max', 'timeend'],
    date: ['date'],
    time: ['time', 'hora'],
    month: ['month', 'mes'],
    year: ['year', 'ano'],
    boolean: ['boolean', 'show', 'mostrar', 'is', 'exibir', 'incluir'],
    status: ['status', 'estado'],
    viewType: ['viewtype'],
    view: ['view', 'visualização'],
    travelType: ['traveltype', 'tipovigem'],
    chartType: ['charttype', 'tipografico'],
    filterType: ['filtertype'],
    unit: ['unit', 'unidade', 'medida'],
    page: ['page', 'pagina'],
    size: ['size', 'pagesize', 'tamanho'],
    interval: ['interval', 'intervalo'],
    period: ['period', 'periodo', 'days', 'dias'],
    periodHours: ['periodfilter', 'horas'],
    search: ['search', 'busca', 'pesquisa', 'termo'],
    machines: ['machines', 'embarcações', 'vessels', 'maquinas'],
  },
};
