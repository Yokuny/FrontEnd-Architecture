import Cross from '@/components/icons/Cross.Icon';
import Down from '@/components/icons/Down.Icon';
import Eye from '@/components/icons/Eye.Icon';
import Left from '@/components/icons/Left.Icon';
import Right from '@/components/icons/Right.Icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemHeader, ItemTitle } from '@/components/ui/item';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { eventColors } from '@/lib/helpers/calendar.helper';
import { formatDate } from '@/lib/helpers/formatDate.helper';
import { t } from '@/lib/helpers/translate.helper';
import type { CalendarView, EventColor, PartialSchedule } from '@/lib/interfaces/schedule.interface';
import { cn } from '@/lib/utils/cn.util';
import { viewDictionary } from '../@consts/schedule.consts';
import type { CustomDateRange } from '../@interface/schedule.interface';

interface ScheduleSidebarProps {
  view: CalendarView;
  currentDate: Date;
  customDateRange: CustomDateRange | null;
  startDate: Date;
  endDate: Date;
  isMobile: boolean;
  isSidebarOpen: boolean;
  upcomingPerProfessional: Array<{ Professional: string; nextEvent: PartialSchedule }>;
  uniqueProfessionalIds: string[];
  getProfessionalName: (id: string | undefined) => string;
  getProfessionalImage: (id: string | undefined) => string | null | undefined;
  getProfessionalColor: (id: string) => string | null | undefined;
  onPrevious: () => void;
  onNext: () => void;
  onTodayClick: () => void;
  onViewChange: (view: CalendarView) => void;
  onDateSelect: (date: Date | undefined) => void;
  onRangeSelect: (range: { from: Date | undefined; to?: Date | undefined } | undefined) => void;
  onViewEvent: (event: PartialSchedule) => void;
  onColorChange: (professionalId: string, color: EventColor) => void;
  onRemoveColor: (professionalId: string | undefined) => void;
}

export function ScheduleSidebar({
  view,
  currentDate,
  customDateRange,
  startDate,
  endDate,
  isMobile,
  isSidebarOpen,
  upcomingPerProfessional,
  uniqueProfessionalIds,
  getProfessionalName,
  getProfessionalImage,
  getProfessionalColor,
  onPrevious,
  onNext,
  onTodayClick,
  onViewChange,
  onDateSelect,
  onRangeSelect,
  onViewEvent,
  onColorChange,
  onRemoveColor,
}: ScheduleSidebarProps) {
  return (
    <CardContent
      className={cn('flex flex-col gap-4 md:self-start', isMobile ? 'w-full' : 'w-72', isMobile ? 'opacity-100' : isSidebarOpen ? 'opacity-100' : 'opacity-0 md:hidden')}
    >
      {/* Mini Calendar Navigation */}
      <ItemContent className="w-full gap-3">
        {view === 'day' && (
          <Calendar
            mode="single"
            selected={currentDate}
            onSelect={onDateSelect}
            className="w-full rounded-md"
            month={currentDate}
            captionLayout="dropdown"
            onMonthChange={onDateSelect}
          />
        )}
        {view === 'month' && (
          <Calendar
            mode="single"
            selected={currentDate}
            onSelect={onDateSelect}
            className="w-full rounded-md"
            month={currentDate}
            captionLayout="dropdown"
            onMonthChange={onDateSelect}
            disabled={{ before: startDate, after: endDate }}
          />
        )}
        {['agenda', 'week'].includes(view) && (
          <Calendar
            mode="range"
            selected={customDateRange || { from: startDate, to: endDate }}
            onSelect={onRangeSelect}
            className="w-full rounded-md"
            month={currentDate}
            captionLayout="dropdown"
            onMonthChange={onDateSelect}
          />
        )}
        <ItemHeader className="px-4">
          <ItemActions className="w-2/3">
            <Button variant="outline" size="sm" onClick={onPrevious} className="w-1/3 rounded-none rounded-l-md border-r-0 px-2">
              <Left className="size-5" />
            </Button>
            <Button variant="outline" size="sm" onClick={onTodayClick} className="w-1/3 rounded-none border-x-0">
              {t('today')}
            </Button>
            <Button variant="outline" size="sm" onClick={onNext} className="w-1/3 rounded-none rounded-r-md border-l-0 px-2">
              <Right className="size-5" />
            </Button>
          </ItemActions>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="w-1/3 justify-evenly">
                <span className="overflow-hidden">{viewDictionary[view]}</span>
                <Down className="-me-1 size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-32">
              <DropdownMenuItem onClick={() => onViewChange('month')}>{t('month')}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onViewChange('week')}>{t('week')}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onViewChange('day')}>{t('day')}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onViewChange('agenda')}>{t('agenda')}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ItemHeader>
      </ItemContent>

      {/* Upcoming Appointments */}
      <ItemGroup className="w-full">
        {upcomingPerProfessional.length === 0 ? (
          <Item className="flex-col gap-1 p-6">
            <ItemTitle>{t('upcoming.consults')}</ItemTitle>
            <ItemDescription>{t('no.upcoming.consults')}</ItemDescription>
          </Item>
        ) : (
          upcomingPerProfessional.map((doc) => (
            <Item key={doc.Professional} className="flex-col gap-2 rounded-md p-4">
              <ItemHeader>
                <ItemActions>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={getProfessionalImage(doc.Professional) || undefined} />
                    <AvatarFallback>{getProfessionalName(doc.Professional).slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <ItemDescription className="line-clamp-1">{getProfessionalName(doc.Professional)}</ItemDescription>
                </ItemActions>
                <Button variant="outline" size="sm" onClick={() => onViewEvent(doc.nextEvent)} className="gap-1 transition-colors">
                  <Eye className="size-4" />
                  <ItemDescription className="text-xs tabular-nums">{t('view')}</ItemDescription>
                </Button>
              </ItemHeader>
              <ItemActions className="items-baseline gap-4">
                <ItemTitle className="text-xl text-yellow-500 tabular-nums dark:text-yellow-400">
                  {doc.nextEvent?.start ? formatDate(doc.nextEvent.start, 'HH:mm') : '--:--'}
                </ItemTitle>
                <ItemDescription className="text-sm">{doc.nextEvent?.start ? formatDate(doc.nextEvent.start) : '--:--'}</ItemDescription>
              </ItemActions>
            </Item>
          ))
        )}
      </ItemGroup>

      {/* Professional Color Manager */}
      <ItemGroup className="w-full px-2">
        {uniqueProfessionalIds.map((profId) => {
          const hasCustomColor = getProfessionalColor(profId);
          const displayColor = hasCustomColor ? eventColors.find((c) => c.value === hasCustomColor) : null;

          return (
            <Item key={profId} className="flex-nowrap items-center justify-evenly gap-2 p-3 md:justify-between">
              <ItemActions className="gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={getProfessionalImage(profId) || undefined} />
                  <AvatarFallback>{getProfessionalName(profId).slice(0, 2)}</AvatarFallback>
                </Avatar>
                <ItemContent className="flex-none">
                  <ItemTitle className="truncate text-md leading-none">{getProfessionalName(profId).slice(0, 8)}</ItemTitle>
                  <ItemDescription className="truncate">{hasCustomColor ? displayColor?.label : t('color.from.status')}</ItemDescription>
                </ItemContent>
              </ItemActions>
              <Select
                value={hasCustomColor || ''}
                onValueChange={(color: EventColor) => {
                  if (color && profId) onColorChange(profId, color);
                }}
              >
                <SelectTrigger size="sm" className="w-30 truncate px-2">
                  <SelectValue placeholder={t('color')} />
                </SelectTrigger>
                <SelectContent>
                  {eventColors.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-1">
                        <div className={`size-3 rounded-full ${color.color}`} />
                        {color.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {hasCustomColor && (
                <Button variant="outline" size="sm" onClick={() => onRemoveColor(profId)} className="size-8 p-0">
                  <Cross className="size-4" />
                </Button>
              )}
            </Item>
          );
        })}
      </ItemGroup>
    </CardContent>
  );
}
