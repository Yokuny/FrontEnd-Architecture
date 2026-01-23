import { AlertTriangle, Bug, Check, CloudOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface StatusIconProps {
  status: 'ok' | 'warning' | 'anomaly' | 'off';
  showText?: boolean;
}

export function StatusIcon({ status, showText = true }: StatusIconProps) {
  const { t } = useTranslation();

  const configs = {
    ok: {
      icon: Check,
      color: 'text-lime-700',
      label: 'Ok',
    },
    warning: {
      icon: AlertTriangle,
      color: 'text-amber-500',
      label: t('warn'),
    },
    anomaly: {
      icon: Bug,
      color: 'text-red-800',
      label: t('anamoly.detected'),
    },
    off: {
      icon: CloudOff,
      color: 'text-muted-foreground',
      label: 'Off-line',
    },
  };

  const config = configs[status] || configs.off;
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-2">
      <Icon className={cn('size-4', config.color)} />
      {showText && <span className={cn('font-medium text-sm', config.color)}>{config.label}</span>}
    </div>
  );
}
