export const FAS_STATUS_LIST = [
  'awaiting.create.confirm',
  'awaiting.request',
  'supplier.canceled',
  'awaiting.buy.request',
  'awaiting.collaborators',
  'awaiting.bms.confirm',
  'bms.refused',
  'awaiting.contract.validation',
  'awaiting.sap',
  'awaiting.bms',
  'awaiting.payment',
  'awaiting.invoice',
  'fas.closed',
  'awaiting.rating',
  'not.realized',
  'not.approved',
  'invoice.rejected',
  'cancelled',
];

export const FAS_PAGINATION_MAX_VISIBLE = 5;
export const FAS_EXPORT_MAX_MONTHS = 6;

export const FAS_RATINGS_KEYS = ['rating.satisfactory', 'rating.regular', 'rating.unsatisfactory'] as const;
export const FAS_RATINGS_ALT_KEYS = ['rating.meets', 'rating.partially', 'rating.does.not.meet', 'rating.not.applicable'] as const;
export const FAS_PARTIAL_EXECUTION_KEYS = ['partial.execution', 'complete.execution'] as const;
export const FAS_RATING_QUESTIONS_COUNT = 7;

export const ORDER_DESCRIPTION_TEMPLATE = `- Resumo:
- Equipamento:
- Modelo:
- Ações Realizadas:
- Ações Necessárias:
- Material e/ou ferramental Necessário:
- Informações pertinentes:
- Inclusão de anexos (Fotos, vídeos, página de manual etc.):
- Necessário TST ou Equipe de Resgate? (S/N)`;
