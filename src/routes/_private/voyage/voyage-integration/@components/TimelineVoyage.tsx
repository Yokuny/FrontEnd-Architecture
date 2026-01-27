import { Box, Calendar, Circle, Flag, Fuel, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ItemTitle } from '@/components/ui/item';
import { formatDate } from '@/lib/formatDate';
import { cn } from '@/lib/utils';
import type { VoyageEvent } from '../@interface/voyage-integration';

interface TimelineVoyageProps {
  events: VoyageEvent[];
}

export function TimelineVoyage({ events }: TimelineVoyageProps) {
  const { t } = useTranslation();

  if (!events?.length) return null;

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'init_travel':
        return { icon: Circle, color: 'text-primary' };
      case 'finish_travel':
        return { icon: Flag, color: 'text-success' };
      case 'load':
        return { icon: Box, color: 'text-info' };
      case 'fuel':
        return { icon: Fuel, color: 'text-primary-foreground bg-primary/90' };
      case 'other':
        return { icon: Info, color: 'text-info' };
      default:
        return { icon: Info, color: 'text-muted-foreground' };
    }
  };

  const getEventTitle = (type: string, customTitle?: string) => {
    const titles: Record<string, string> = {
      init_travel: t('departure'),
      finish_travel: t('arrival'),
      load: t('load.active'),
      fuel: t('fill'),
      other: t('other'),
    };
    return `${titles[type] || t('default')}${customTitle ? ` ${customTitle}` : ''}`;
  };

  return (
    <div className="flex flex-col gap-3 py-4">
      <div className="flex items-center gap-2">
        <Calendar className="size-4 text-primary" />
        <ItemTitle className="text-xs uppercase tracking-wider opacity-70">{t('events')}</ItemTitle>
      </div>

      <div className="mt-2 ml-2 flex flex-col">
        {events.map((event, i) => {
          const { icon: Icon, color } = getEventIcon(event.type);
          const isLast = i === events.length - 1;

          return (
            <div key={`${event.type}-${event.dateTimeStart}`} className="relative flex gap-4">
              {!isLast && <div className="absolute top-[20px] bottom-0 left-[7px] w-[2px] bg-muted/50" />}

              <div className={cn('relative z-10 flex size-4 shrink-0 items-center justify-center rounded-full border border-border bg-background p-1', color)}>
                <Icon className="size-2.5" />
              </div>

              <div className="flex min-w-0 flex-1 flex-col pb-6">
                <span className="font-bold text-[10px] text-muted-foreground uppercase leading-none tracking-tight">{getEventTitle(event.type, event.title)}</span>
                <span className="mt-1 truncate font-medium text-xs">{event.description}</span>
                <div className="mt-1.5 flex flex-col gap-0.5 font-mono text-[10px] text-muted-foreground/80">
                  <span>
                    {formatDate(new Date(event.dateTimeStart), 'dd MMM, HH:mm')}
                    {event.dateTimeEnd && ` - ${formatDate(new Date(event.dateTimeEnd), 'HH:mm')}`}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
