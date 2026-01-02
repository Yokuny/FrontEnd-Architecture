export const FORM_TYPES = [
  { value: 'RVE', label: 'RVE' },
  { value: 'EVENT_REPORT', label: 'Relatório de evento diário' },
  { value: 'FILL_ONBOARD', label: 'fill.onboard' },
  { value: 'OTHER', label: 'other' },
  { value: 'NOON_REPORT', label: 'Noon Report' },
  { value: 'POLL', label: 'polling' },
  { value: 'RDO', label: 'RDO' },
  { value: 'EVENT', label: 'event' },
  { value: 'CMMS', label: 'CMMS' },
] as const;

export const FIELD_DATATYPES = [
  { value: 'text', label: 'Texto', color: '#598bff' },
  { value: 'number', label: 'Número', color: '#00d68f' },
  { value: 'date', label: 'Data', color: '#ffaa00' },
  { value: 'time', label: 'Hora', color: '#ff3d71' },
  { value: 'select', label: 'Seleção', color: '#7b44d3' },
  { value: 'checkbox', label: 'Checkbox', color: '#222b45' },
  { value: 'image', label: 'Imagem', color: '#0095ff' },
  { value: 'signature', label: 'Assinatura', color: '#3366ff' },
  { value: 'selectUsers', label: 'Seleção de Usuários', color: '#10dc60' },
  { value: 'selectMachine', label: 'Seleção de Máquina', color: '#32dbda' },
  { value: 'table', label: 'Tabela', color: '#ffcc00' },
  { value: 'group', label: 'Grupo', color: '#8f9bb3' },
  { value: 'author', label: 'Autor', color: '#c5cee0' },
] as const;

export const FIELD_SIZES = [
  { value: '12', label: '100%' },
  { value: '6', label: '50%' },
  { value: '4', label: '33%' },
  { value: '3', label: '25%' },
  { value: '8', label: '66%' },
] as const;
