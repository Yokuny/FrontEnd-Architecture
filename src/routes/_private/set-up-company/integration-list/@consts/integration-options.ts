// Opções de tipo de integração AIS
export const INTEGRATION_OPTIONS = [
  { value: 'OPT', label: 'AIS' },
  { value: 'HF', label: 'AIS HF (Beta)' },
  { value: 'SP', label: 'AIS SPIRE (Beta)' },
  { value: 'OT', label: 'Ocean' },
  { value: 'MID', label: 'Middleware' },
  { value: 'OTHER', label: 'Outros' },
  { value: 'SP_OPT', label: 'AIS SPIRE + OPT (Beta)', disabled: true },
  { value: 'EL', label: 'AIS EL (Beta)', disabled: true },
  { value: 'MOON', label: 'AIS (F/M)', disabled: true },
  { value: 'VT', label: 'AIS VT (Beta)', disabled: true },
  { value: 'SF', label: 'AIS SF (Beta)', disabled: true },
  { value: 'VF', label: 'AIS VF (Beta)', disabled: true },
] as const;

// Tipos que requerem campo MMSI
export const TYPES_WITH_MMSI = ['VF', 'VT', 'HF', 'SF', 'EL', 'SP', 'SP_OPT'] as const;

// Tipos que requerem campo IMO
export const TYPES_WITH_IMO = ['OPT', 'SP_OPT'] as const;

// Helper para converter minutos em milissegundos
function minutesToMs(minutes: number): number {
  return minutes * 60 * 1000;
}

// Opções de intervalo de atualização
export const UPDATE_INTERVAL_OPTIONS = [
  { value: minutesToMs(1), label: '1 min' },
  { value: minutesToMs(2), label: '2 min' },
  { value: minutesToMs(5), label: '5 min' },
  { value: minutesToMs(10), label: '10 min' },
  { value: minutesToMs(15), label: '15 min' },
  { value: minutesToMs(30), label: '30 min' },
  { value: minutesToMs(60), label: '60 min' },
] as const;
