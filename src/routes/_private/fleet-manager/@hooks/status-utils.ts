export const STATUS_COLORS: Record<string, string> = {
  success: '#00d68f',
  danger: '#ff3d71',
  warning: '#ffaa00',
  primary: '#3366ff',
  info: '#0095ff',
  basic800: '#192038',
  basic600: '#8f9bb3',
  basic100: '#f7f9fc',
  purple: '#9b59b6',
};

export const getNavigationStatusColor = (status: string | undefined): string | null => {
  if (!status) return null;
  const s = status.toLowerCase().replace(/_/g, ' ');

  if (
    s.includes('underway using engine') ||
    s.includes('under way using engine') ||
    s.includes('underway') ||
    s.includes('under way') ||
    s.includes('transit') ||
    s.includes('slow')
  ) {
    return STATUS_COLORS.success;
  }

  if (s.includes('at anchor') || s.includes('stopped') || s.includes('stop')) {
    return STATUS_COLORS.warning;
  }

  if (s.includes('moored') || s.includes('port')) {
    return STATUS_COLORS.primary;
  }

  if (s.includes('dock')) {
    return '#404040'; // Dark Warning
  }

  if (s.includes('dp')) {
    return STATUS_COLORS.info;
  }

  if (s.includes('stand by') || s.includes('standby') || s.includes('restricted manoeuvrability')) {
    return '#ff8116';
  }

  if (s.includes('fast transit')) {
    return '#00845a';
  }

  if (s.includes('underway by sail')) {
    return STATUS_COLORS.info;
  }

  return STATUS_COLORS.basic600;
};

export const getOperationStatusColor = (status: string | undefined): string | null => {
  if (!status) return null;

  switch (status.toLowerCase()) {
    case 'downtime':
      return STATUS_COLORS.danger;
    case 'downtime-parcial':
      return STATUS_COLORS.warning;
    case 'operacao':
      return STATUS_COLORS.success;
    case 'laid-up':
      return STATUS_COLORS.basic800;
    case 'off-hire':
      return STATUS_COLORS.basic100;
    case 'mobilizacao':
      return STATUS_COLORS.primary;
    case 'dockage':
      return STATUS_COLORS.basic600;
    case 'desmobilizacao':
      return STATUS_COLORS.warning;
    case 'parada-programada':
      return STATUS_COLORS.purple;
    default:
      return null;
  }
};
