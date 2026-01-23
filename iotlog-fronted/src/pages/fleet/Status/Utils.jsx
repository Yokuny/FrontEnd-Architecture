export const orderedStatus = [
  'downtime',
  'downtime-parcial',
  'parada-programada',
  'dockage',
  'mobilizacao',
  'desmobilizacao',
  'operacao',
  'laid-up',
  'off-hire'];

export const getIconStatusOperation = (status) => {
  switch (status) {
    case 'downtime':
      return {
        icon: '🔴',
        colorTheme: 'colorDanger500',
        label: 'Downtime'
      };
    case 'downtime-parcial':
      return {
        icon: '🟠',
        colorTheme: 'colorWarning500',
        label: 'Downtime Parcial'
      };
    case 'operacao':
      return {
        icon: '🟢',
        colorTheme: 'colorSuccess500',
        label: 'Operação'
      };
    case 'laid-up':
      return {
        icon: '⚫',
        colorTheme: 'colorBasic800',
        label: 'Laid-up'
      };
    case 'off-hire':
      return {
        icon: '⚪',
        colorTheme: 'colorBasic100',
        label: 'Sem contrato'
      };
    case 'mobilizacao':
      return {
        icon: '🔵',
        colorTheme: 'colorPrimary500',
        label: 'Mobilização'
      };
    case 'dockage':
      return {
        icon: '🟤',
        colorTheme: 'colorBasic600',
        label: 'Docagem'
      };
    case 'desmobilizacao':
      return {
        icon: '🟡',
        colorTheme: 'colorWarning500',
        label: 'Desmobilização'
      };
    case 'parada-programada':
      return {
        icon: '🟣',
        color: '#9b59b6',
        label: 'Parada Programada'
      };
    default:
      return null;
  }
}
