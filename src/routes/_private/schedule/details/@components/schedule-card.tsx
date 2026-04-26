import Calender from '@/components/icons/Calender.Icon';
import Clinic from '@/components/icons/Clinic.Icon';
import Clock from '@/components/icons/Clock.Icon';
import Dollar from '@/components/icons/Dollar.Icon';
import Mail from '@/components/icons/Mail.Icon';
import MapIcon from '@/components/icons/Map.Icon';
import Right from '@/components/icons/Right.Icon';
import { translatedStatusLabel } from '@/components/schedule/status-label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Item, ItemContent, ItemFooter, ItemHeader, ItemTitle } from '@/components/ui/item';
import { useIsMobile } from '@/hooks/use-mobile';
import { formatDate } from '@/lib/helpers/formatDate.helper';
import { getStatusColor } from '@/lib/helpers/formatter.helper';
import { t } from '@/lib/helpers/translate.helper';
import type { DbSchedule } from '@/lib/interfaces/schedule.interface';
import { cn } from '@/lib/utils/cn.util';

interface ScheduleCardProps {
  schedule: DbSchedule;
  getRoomName: (roomId: string | undefined) => string | undefined;
  getProfessionalName: (profId: string | undefined) => string | undefined;
}

export function ScheduleCard({ schedule, getRoomName, getProfessionalName }: ScheduleCardProps) {
  const isMobile = useIsMobile();

  const renderScheduleDateTime = () => {
    const startDate = new Date(schedule.start);
    const endDate = new Date(schedule.end);
    const startDateStr = formatDate(startDate);
    const endDateStr = formatDate(endDate);
    const isSameDay = startDateStr === endDateStr;

    if (schedule.allDay) {
      return (
        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-2">
            <Calender className="size-5" />
            <ItemTitle className="text-xl tabular-nums md:text-2xl">{startDateStr}</ItemTitle>
          </div>
          <Right className="size-4" />
          <div className="flex items-center gap-2">
            <Calender className="size-5" />
            <ItemTitle className="text-md tabular-nums md:text-base">{endDateStr}</ItemTitle>
          </div>
          {!isMobile && (
            <Badge variant="info" className="gap-2 [&>svg]:size-4">
              <Clock />
              {t('all.day')}
            </Badge>
          )}
        </div>
      );
    }

    if (isSameDay) {
      return (
        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-2">
            <Calender className="size-5" />
            <ItemTitle className="text-xl tabular-nums md:text-2xl">{startDateStr}</ItemTitle>
          </div>
          <Right className="size-4" />
          <div className="flex items-center gap-2">
            <Clock className="size-5" />
            <div className="flex items-center gap-1">
              <ItemTitle className="text-md tabular-nums md:text-base">{formatDate(startDate, 'HH:mm')}</ItemTitle>
              <span className="text-muted-foreground">-</span>
              <ItemTitle className="text-md tabular-nums md:text-base">{formatDate(endDate, 'HH:mm')}</ItemTitle>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 md:gap-4">
        <div className="flex items-center gap-2">
          <Calender className="size-5" />
          <ItemTitle className="text-xl tabular-nums md:text-2xl">{formatDate(startDate, 'dd MMM yyy HH:ss')}</ItemTitle>
        </div>
        <div className="flex items-center gap-2">
          <Right className="size-4" />
          <Calender className="size-5" />
          <ItemTitle className="text-md tabular-nums md:text-base">{formatDate(endDate, 'dd MMM yyy HH:ss')}</ItemTitle>
        </div>
      </div>
    );
  };

  return (
    <Item variant="info" className="flex-col items-start gap-2 p-4 md:p-6">
      <ItemHeader className="w-full">
        <ItemTitle className="capitalize">{formatDate(schedule.start, 'EEEE')}</ItemTitle>
        <Badge variant="info" className="gap-1.5">
          <div className={cn('size-2 rounded-full', getStatusColor(schedule.status))} />
          {translatedStatusLabel(schedule.status)}
        </Badge>
      </ItemHeader>

      <ItemContent className="w-full">{renderScheduleDateTime()}</ItemContent>

      <ItemFooter className="flex-wrap justify-start gap-2 pt-1 md:pt-2">
        <Button variant="primary" size="sm" className="h-auto items-center gap-2 px-2 py-1">
          <MapIcon className="size-4" />
          <span className="text-muted-foreground text-xs">{getRoomName(schedule.Room)}</span>
        </Button>
        {schedule.Professional && (
          <Button variant="primary" size="sm" className="h-auto items-center gap-2 px-2 py-1">
            <Clinic className="size-4" />
            <span className="text-muted-foreground text-xs">{getProfessionalName(schedule.Professional)}</span>
          </Button>
        )}
        {schedule.Financial && (
          <Button variant="primary" size="sm" className="h-auto items-center gap-2 px-2 py-1">
            <Dollar className="size-4" />
            <span className="text-muted-foreground text-xs">{t('linked')}</span>
          </Button>
        )}
        {schedule.title && (
          <Button variant="primary" size="sm" className="h-auto items-center gap-2 px-2 py-1">
            <Mail className="size-4" />
            <span className="text-muted-foreground text-xs">{schedule.title}</span>
          </Button>
        )}
      </ItemFooter>
    </Item>
  );
}
