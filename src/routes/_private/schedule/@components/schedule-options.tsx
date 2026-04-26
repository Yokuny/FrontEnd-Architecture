import Cross from '@/components/icons/Cross.Icon';
import Down from '@/components/icons/Down.Icon';
import Eye from '@/components/icons/Eye.Icon';
import Left from '@/components/icons/Left.Icon';
import Right from '@/components/icons/Right.Icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Calendar } from '@/components/ui/calendar';
import { CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemHeader, ItemTitle } from '@/components/ui/item';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { eventColors } from '@/lib/helpers/calendar.helper';
import { formatDate } from '@/lib/helpers/formatDate.helper';
import { t } from '@/lib/helpers/translate.helper';
import type { EventColor, PartialSchedule } from '@/lib/interfaces/schedule.interface';
import { viewDictionary } from '../@consts/schedule.consts';
import type { ScheduleCalendar } from '../@hooks/use-schedule-calendar';

interface ScheduleOptionsProps {
  calendar: ScheduleCalendar;
  upcomingPerProfessional: Array<{ Professional: string; nextEvent: PartialSchedule }>;
  uniqueProfessionalIds: string[];
  getProfessionalName: (id: string | undefined) => string;
  getProfessionalImage: (id: string | undefined) => string | null | undefined;
  getProfessionalColor: (id: string) => string | null | undefined;
  onViewEvent: (event: PartialSchedule) => void;
  onColorChange: (professionalId: string, color: EventColor) => void;
  onRemoveColor: (professionalId: string | undefined) => void;
}

export function ScheduleOptions({
  calendar,
  upcomingPerProfessional,
  uniqueProfessionalIds,
  getProfessionalName,
  getProfessionalImage,
  getProfessionalColor,
  onViewEvent,
  onColorChange,
  onRemoveColor,
}: ScheduleOptionsProps) {
  const { view, setView, currentDate, customDateRange, startDate, endDate, handlePrevious, handleNext, handleTodayClick, handleDateSelect, handleRangeSelect } = calendar;

  return (
    <CardContent className="flex w-full flex-col gap-4 px-4 pt-0 pb-6 md:px-6">
      <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-4">
        {/* Mini Calendar Navigation */}
        <ItemContent className="flex min-w-0 flex-1 flex-col gap-3">
          {view === 'day' && (
            <Calendar
              mode="single"
              selected={currentDate}
              onSelect={handleDateSelect}
              className="w-full rounded-md"
              month={currentDate}
              captionLayout="dropdown"
              onMonthChange={handleDateSelect}
            />
          )}
          {view === 'month' && (
            <Calendar
              mode="single"
              selected={currentDate}
              onSelect={handleDateSelect}
              className="w-full rounded-md"
              month={currentDate}
              captionLayout="dropdown"
              onMonthChange={handleDateSelect}
              disabled={{ before: startDate, after: endDate }}
            />
          )}
          {['agenda', 'week'].includes(view) && (
            <Calendar
              mode="range"
              selected={customDateRange || { from: startDate, to: endDate }}
              onSelect={handleRangeSelect}
              className="w-full rounded-md"
              month={currentDate}
              captionLayout="dropdown"
              onMonthChange={handleDateSelect}
            />
          )}
          <ItemHeader className="w-full px-4">
            <ItemActions className="min-w-0 grow-2 basis-0 gap-0">
              <ButtonGroup className="w-full">
                <Button size="sm" onClick={handlePrevious} className="w-1/3">
                  <Left className="size-5" />
                </Button>
                <Button size="sm" onClick={handleTodayClick} className="w-1/3">
                  {t('today')}
                </Button>
                <Button size="sm" onClick={handleNext} className="w-1/3">
                  <Right className="size-5" />
                </Button>
              </ButtonGroup>
            </ItemActions>
            <div className="min-w-0 grow basis-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" className="w-full justify-evenly">
                    <span className="overflow-hidden">{viewDictionary[view]}</span>
                    <Down className="-me-1 size-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setView('month')}>{t('month')}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setView('week')}>{t('week')}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setView('day')}>{t('day')}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setView('agenda')}>{t('agenda')}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </ItemHeader>
        </ItemContent>

        <Separator className="lg:hidden" />
        <Separator orientation="vertical" className="hidden lg:block lg:h-auto lg:self-stretch" />

        {/* Upcoming Appointments */}
        <ItemGroup className="min-w-0 flex-1">
          {upcomingPerProfessional.length === 0 ? (
            <Item className="flex-col gap-1 p-6">
              <ItemTitle>{t('upcoming.consults')}</ItemTitle>
              <ItemDescription>{t('no.upcoming.consults')}</ItemDescription>
            </Item>
          ) : (
            upcomingPerProfessional.map((doc) => (
              <Item key={doc.Professional}>
                <ItemHeader>
                  <div className="flex items-center gap-2">
                    <Avatar className="size-10">
                      <AvatarImage src={getProfessionalImage(doc.Professional) || undefined} />
                      <AvatarFallback>{getProfessionalName(doc.Professional).slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <ItemDescription className="truncate">{t('professional')}</ItemDescription>
                      <ItemTitle className="truncate text-md leading-none">{getProfessionalName(doc.Professional).slice(0, 8)}</ItemTitle>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-baseline">
                      <ItemDescription className="text-sm">{doc.nextEvent?.start ? formatDate(doc.nextEvent.start) : '--:--'}</ItemDescription>
                      <ItemTitle className="text-xl text-yellow-500 tabular-nums dark:text-yellow-400">
                        {doc.nextEvent?.start ? formatDate(doc.nextEvent.start, 'HH:mm') : '--:--'}
                      </ItemTitle>
                    </div>
                    <Button size="sm" onClick={() => onViewEvent(doc.nextEvent)}>
                      <Eye className="size-4" />
                      <ItemDescription>{t('view')}</ItemDescription>
                    </Button>
                  </div>
                </ItemHeader>
              </Item>
            ))
          )}
        </ItemGroup>

        <Separator className="lg:hidden" />
        <Separator orientation="vertical" className="hidden lg:block lg:h-auto lg:self-stretch" />

        {/* Professional Color Manager */}
        <ItemGroup className="min-w-0 flex-1">
          {uniqueProfessionalIds.map((profId) => {
            const hasCustomColor = getProfessionalColor(profId);
            const displayColor = hasCustomColor ? eventColors.find((c) => c.value === hasCustomColor) : null;

            return (
              <Item key={profId}>
                <ItemHeader>
                  <div className="flex items-center gap-2">
                    <Avatar className="size-10">
                      <AvatarImage src={getProfessionalImage(profId) || undefined} />
                      <AvatarFallback>{getProfessionalName(profId).slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <ItemTitle className="truncate text-md leading-none">{getProfessionalName(profId).slice(0, 8)}</ItemTitle>
                      <ItemDescription className="truncate">{hasCustomColor ? displayColor?.label : t('color.from.status')}</ItemDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={hasCustomColor || ''}
                      onValueChange={(color: EventColor) => {
                        if (color && profId) onColorChange(profId, color);
                      }}
                    >
                      <SelectTrigger className="min-w-30 truncate">
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
                      <Button onClick={() => onRemoveColor(profId)}>
                        <Cross className="size-4" />
                      </Button>
                    )}
                  </div>
                </ItemHeader>
              </Item>
            );
          })}
        </ItemGroup>
      </div>
    </CardContent>
  );
}
