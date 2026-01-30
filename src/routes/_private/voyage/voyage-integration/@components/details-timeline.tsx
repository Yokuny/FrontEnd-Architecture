import { ArrowDownCircle, Box, Calendar, Flag, Fuel, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import { formatDate } from '@/lib/formatDate';
import { cn } from '@/lib/utils';
import type { VoyageEvent } from '../@interface/voyage-integration';

export function TimelineVoyage({ events }: TimelineVoyageProps) {
  const { t } = useTranslation();

  if (!events?.length) return null;

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'init_travel':
        return { icon: ArrowDownCircle, color: 'text-primary' };
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
    <div className="flex flex-col gap-2 py-3">
      <ItemContent className="flex-row text-muted-foreground">
        <Calendar className="size-3 text-primary" />
        <ItemTitle className="text-xs uppercase tracking-wide">{t('events')}</ItemTitle>
      </ItemContent>

      <div className="mt-1 ml-1 flex flex-col">
        {events.map((event, i) => {
          const { icon: Icon, color } = getEventIcon(event.type);
          const isLast = i === events.length - 1;

          return (
            <div key={`${event.type}-${event.dateTimeStart}`} className="relative flex items-center gap-2">
              {!isLast && <div className="absolute top-0 bottom-0 left-[9px] w-[2px] bg-accent" />}

              <div className={cn('relative z-10 flex size-5 shrink-0 items-center justify-center bg-background', color)}>
                <Icon className="size-4" />
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-0.5 py-3">
                <ItemTitle className="text-[10px] text-muted-foreground uppercase leading-none">{getEventTitle(event.type, event.title)}</ItemTitle>
                <ItemTitle className="truncate font-medium">{event.description}</ItemTitle>
                <ItemDescription className="text-[10px]">
                  {formatDate(new Date(event.dateTimeStart), 'dd MMM, HH:mm')}
                  {event.dateTimeEnd && ` - ${formatDate(new Date(event.dateTimeEnd), 'HH:mm')}`}
                </ItemDescription>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface TimelineVoyageProps {
  events: VoyageEvent[];
}
