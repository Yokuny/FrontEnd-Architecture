import { Anchor, Pause, Play, Ship, Zap } from 'lucide-react';

export const getStatusOperationInfo = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'downtime':
      return {
        icon: '🔴',
        label: 'Downtime',
        color: 'text-rose-500',
      };
    case 'downtime-parcial':
      return {
        icon: '🟠',
        label: 'Downtime Parcial',
        color: 'text-amber-500',
      };
    case 'operacao':
      return {
        icon: '🟢',
        label: 'Operação',
        color: 'text-emerald-500',
      };
    case 'laid-up':
      return {
        icon: '⚫',
        label: 'Laid-up',
        color: 'text-slate-800',
      };
    case 'off-hire':
      return {
        icon: '⚪',
        label: 'Sem contrato',
        color: 'text-slate-400',
      };
    case 'mobilizacao':
      return {
        icon: '🔵',
        label: 'Mobilização',
        color: 'text-blue-500',
      };
    case 'dockage':
      return {
        icon: '🟤',
        label: 'Docagem',
        color: 'text-amber-900',
      };
    case 'desmobilizacao':
      return {
        icon: '🟡',
        label: 'Desmobilização',
        color: 'text-amber-400',
      };
    case 'parada-programada':
      return {
        icon: '🟣',
        label: 'Parada Programada',
        color: 'text-purple-500',
      };
    default:
      return null;
  }
};

export const getNavigationStatusInfo = (status: string) => {
  const normalized = status?.toString()?.toLowerCase() || '';

  if (['underway using engine', 'underway_using_engine', 'underway', 'under way', 'transit', 'fast transit', 'slow'].includes(normalized)) {
    return {
      label: 'in.travel',
      icon: Play,
      color: 'bg-emerald-500',
    };
  }

  if (['at anchor', 'at_anchor', 'stopped', 'stop', 'moored', 'port', 'dock'].includes(normalized)) {
    return {
      label: normalized === 'moored' || normalized === 'port' ? 'moored' : 'at.anchor',
      icon: Anchor,
      color: normalized === 'moored' || normalized === 'port' ? 'bg-blue-500' : 'bg-amber-500',
    };
  }

  if (normalized === 'dp') {
    return {
      label: 'DP',
      icon: Zap,
      color: 'bg-cyan-500',
    };
  }

  if (normalized === 'stand by' || normalized === 'stand_by' || normalized === 'standby') {
    return {
      label: 'Stand by',
      icon: Pause,
      color: 'bg-orange-500',
    };
  }

  return {
    label: 'other',
    icon: Ship,
    color: 'bg-slate-500',
  };
};
