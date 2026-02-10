/**
 * Multi-language synonyms dictionary for query parameter extraction.
 * Maps normalized English values to their equivalents in pt/es/en.
 */

// ============================================================================
// DATE/TIME SYNONYMS
// ============================================================================

export const MONTH_NAMES: Record<string, number> = {
  // Portuguese
  janeiro: 1,
  fevereiro: 2,
  março: 3,
  marco: 3,
  abril: 4,
  maio: 5,
  junho: 6,
  julho: 7,
  agosto: 8,
  setembro: 9,
  outubro: 10,
  novembro: 11,
  dezembro: 12,
  jan: 1,
  fev: 2,
  mar: 3,
  abr: 4,
  mai: 5,
  jun: 6,
  jul: 7,
  ago: 8,
  set: 9,
  out: 10,
  nov: 11,
  dez: 12,
  // Spanish
  enero: 1,
  febrero: 2,
  marzo: 3,
  abril_es: 4,
  mayo: 5,
  junio: 6,
  julio: 7,
  agosto_es: 8,
  septiembre: 9,
  octubre: 10,
  noviembre: 11,
  diciembre: 12,
  // English
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12,
};

export const RELATIVE_DATE_PATTERNS: Record<string, (now: Date) => { start: Date; end: Date }> = {
  // Today
  hoje: (now) => ({ start: now, end: now }),
  hoy: (now) => ({ start: now, end: now }),
  today: (now) => ({ start: now, end: now }),

  // Yesterday
  ontem: (now) => {
    const d = new Date(now);
    d.setDate(d.getDate() - 1);
    return { start: d, end: d };
  },
  ayer: (now) => {
    const d = new Date(now);
    d.setDate(d.getDate() - 1);
    return { start: d, end: d };
  },
  yesterday: (now) => {
    const d = new Date(now);
    d.setDate(d.getDate() - 1);
    return { start: d, end: d };
  },
};

// Patterns for "last X days/weeks/months" - to be parsed dynamically
export const PERIOD_KEYWORDS = {
  days: ['dias', 'días', 'days', 'day', 'dia', 'día'],
  weeks: ['semanas', 'semana', 'weeks', 'week'],
  months: ['meses', 'mes', 'months', 'month', 'mês'],
  hours: ['horas', 'hora', 'hours', 'hour'],
};

export const LAST_KEYWORDS = ['último', 'últimos', 'última', 'últimas', 'ultimo', 'ultimos', 'ultima', 'ultimas', 'last', 'past', 'previous'];
export const THIS_KEYWORDS = ['este', 'esta', 'esse', 'essa', 'this', 'current'];

// ============================================================================
// BOOLEAN SYNONYMS
// ============================================================================

export const BOOLEAN_TRUE_SYNONYMS = [
  // Portuguese
  'sim',
  'ativo',
  'ativa',
  'ativos',
  'ativas',
  'habilitado',
  'habilitada',
  'habilitados',
  'habilitadas',
  'mostrar',
  'exibir',
  'incluir',
  'com',
  'verdadeiro',
  'ligado',
  // Spanish
  'sí',
  'si',
  'activo',
  'activa',
  'activos',
  'activas',
  'habilitado_es',
  'mostrar_es',
  'incluir_es',
  'con',
  'verdadero',
  // English
  'yes',
  'true',
  'active',
  'enabled',
  'show',
  'display',
  'include',
  'with',
  'on',
];

export const BOOLEAN_FALSE_SYNONYMS = [
  // Portuguese
  'não',
  'nao',
  'inativo',
  'inativa',
  'inativos',
  'inativas',
  'desabilitado',
  'desabilitada',
  'desabilitados',
  'desabilitadas',
  'ocultar',
  'esconder',
  'excluir',
  'sem',
  'falso',
  'desligado',
  // Spanish
  'no',
  'inactivo',
  'inactiva',
  'inactivos',
  'inactivas',
  'deshabilitado',
  'ocultar_es',
  'excluir_es',
  'sin',
  'falso_es',
  // English
  'false',
  'inactive',
  'disabled',
  'hide',
  'exclude',
  'without',
  'off',
];

// Boolean parameter keywords mapping
export const BOOLEAN_PARAM_KEYWORDS: Record<string, string[]> = {
  showInoperabilities: ['inoperabilidade', 'inoperabilidades', 'inoperability', 'inoperabilities', 'inoperabilidad'],
  isShowDisabled: ['desabilitado', 'desabilitados', 'disabled', 'deshabilitado', 'inativo', 'inativos', 'inactive'],
  showValueByPayment: ['pagamento', 'payment', 'pago', 'valor pago', 'data de pagamento'],
  edit: ['editar', 'edição', 'edit', 'editing', 'edición', 'modo edição', 'edit mode'],
  transfer: ['transferir', 'transferência', 'transfer', 'transferencia'],
  equipmentCritical: ['crítico', 'critico', 'critical', 'críticos', 'criticos'],
};

// ============================================================================
// STATUS SYNONYMS
// ============================================================================

export const STATUS_SYNONYMS: Record<string, string[]> = {
  in_travel: [
    'em viagem',
    'viajando',
    'navegando',
    'em trânsito',
    'em transito',
    'in travel',
    'traveling',
    'travelling',
    'sailing',
    'in transit',
    'en viaje',
    'viajando_es',
    'navegando_es',
    'en tránsito',
  ],
  finished: [
    'finalizado',
    'finalizada',
    'concluído',
    'concluida',
    'terminado',
    'terminada',
    'completo',
    'completa',
    'finished',
    'completed',
    'done',
    'ended',
    'terminado_es',
    'completado',
    'finalizado_es',
  ],
  pending: ['pendente', 'pendentes', 'aguardando', 'em espera', 'pending', 'waiting', 'on hold', 'pendiente', 'esperando', 'en espera'],
  cancelled: ['cancelado', 'cancelada', 'cancelados', 'canceladas', 'cancelled', 'canceled', 'cancelado_es'],
  active: ['ativo', 'ativa', 'ativos', 'ativas', 'em andamento', 'active', 'ongoing', 'in progress', 'activo', 'activa', 'en progreso'],
  scheduled: ['agendado', 'agendada', 'programado', 'programada', 'scheduled', 'planned', 'programado_es', 'agendado_es'],
};

// ============================================================================
// VIEW/TYPE SYNONYMS
// ============================================================================

export const VIEW_TYPE_SYNONYMS: Record<string, string[]> = {
  consumption: ['consumo', 'consumption', 'consumido', 'gasto', 'usado'],
  stock: ['estoque', 'stock', 'inventário', 'inventory', 'inventario', 'armazenado'],
};

export const VIEW_SYNONYMS: Record<string, string[]> = {
  operational: ['operacional', 'operational', 'operativo', 'operação', 'operation', 'operación'],
  financial: ['financeiro', 'financial', 'financeiro', 'finanças', 'finance', 'financiero'],
};

export const TRAVEL_TYPE_SYNONYMS: Record<string, string[]> = {
  travel: ['viagem', 'viagens', 'travel', 'travels', 'voyage', 'voyages', 'viaje', 'viajes'],
  maneuver: ['manobra', 'manobras', 'maneuver', 'maneuvers', 'maniobra', 'maniobras'],
  manualVoyage: ['viagem manual', 'manual voyage', 'viaje manual', 'voyage manual'],
};

export const CHART_TYPE_SYNONYMS: Record<string, string[]> = {
  line: ['linha', 'line', 'línea', 'lineal'],
  bar: ['barra', 'barras', 'bar', 'bars'],
  pie: ['pizza', 'pie', 'torta', 'circular'],
  area: ['área', 'area', 'área_es'],
};

// ============================================================================
// UNIT SYNONYMS
// ============================================================================

export const UNIT_SYNONYMS: Record<string, string[]> = {
  L: ['litro', 'litros', 'liter', 'liters', 'litre', 'litres', 'l', 'L'],
  'm³': ['metro cúbico', 'metros cúbicos', 'metro cubico', 'metros cubicos', 'cubic meter', 'cubic meters', 'm³', 'm3'],
  gal: ['galão', 'galões', 'galao', 'galoes', 'gallon', 'gallons', 'gal'],
};

// ============================================================================
// PAGINATION KEYWORDS
// ============================================================================

export const PAGE_KEYWORDS = ['página', 'pagina', 'page', 'pág', 'pag', 'pg'];
export const SIZE_KEYWORDS = ['por página', 'por pagina', 'per page', 'itens', 'items', 'registros', 'records', 'resultados', 'results'];
export const INTERVAL_KEYWORDS = ['intervalo', 'interval', 'a cada', 'every', 'cada'];
export const PERIOD_NUMBER_KEYWORDS = ['período', 'periodo', 'period', 'duração', 'duracion', 'duration'];

// ============================================================================
// FILTER TYPE
// ============================================================================

export const FILTER_TYPE_SYNONYMS: Record<string, string[]> = {
  range: ['intervalo', 'range', 'período', 'period', 'faixa', 'entre', 'between', 'de...até', 'from...to'],
  month: ['mensal', 'mês', 'mes', 'month', 'monthly', 'por mês', 'by month'],
};
