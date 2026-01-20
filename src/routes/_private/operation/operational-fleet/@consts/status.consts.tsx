export interface StatusConfig {
  icon: string;
  colorTheme: string;
  label: string;
}

export const STATUS_CONFIGS: Record<string, StatusConfig> = {
  downtime: {
    icon: '🔴',
    colorTheme: 'destructive',
    label: 'Downtime',
  },
  'downtime-parcial': {
    icon: '🟠',
    colorTheme: 'warning',
    label: 'Downtime Parcial',
  },
  operacao: {
    icon: '🟢',
    colorTheme: 'success',
    label: 'Operação',
  },
  'laid-up': {
    icon: '⚫',
    colorTheme: 'muted',
    label: 'Laid-up',
  },
  'off-hire': {
    icon: '⚪',
    colorTheme: 'muted',
    label: 'Sem contrato',
  },
  mobilizacao: {
    icon: '🔵',
    colorTheme: 'primary',
    label: 'Mobilização',
  },
  dockage: {
    icon: '🟤',
    colorTheme: 'muted',
    label: 'Docagem',
  },
  desmobilizacao: {
    icon: '🟡',
    colorTheme: 'warning',
    label: 'Desmobilização',
  },
  'parada-programada': {
    icon: '🟣',
    colorTheme: 'secondary',
    label: 'Parada Programada',
  },
};

export const getIconStatusOperation = (status: string): StatusConfig => {
  return (
    STATUS_CONFIGS[status] || {
      icon: '❓',
      colorTheme: 'muted',
      label: status,
    }
  );
};

export const getStatusColor = (percent: number) => {
  if (percent >= 90) return 'success';
  if (percent >= 70) return 'warning';
  return 'destructive';
};
