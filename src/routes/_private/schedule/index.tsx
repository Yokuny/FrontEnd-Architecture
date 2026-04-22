import { createFileRoute } from '@tanstack/react-router';
import { addDays, addMonths, addWeeks, endOfWeek, isSameMonth, startOfWeek, subMonths, subWeeks } from 'date-fns';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import Add from '@/components/icons/Add.Icon';
import Cross from '@/components/icons/Cross.Icon';
import Down from '@/components/icons/Down.Icon';
import Eye from '@/components/icons/Eye.Icon';
import Grid from '@/components/icons/Grid.Icon';
import Left from '@/components/icons/Left.Icon';
import Right from '@/components/icons/Right.Icon';
import { ScheduleDialog } from '@/components/schedule';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Calendar } from '@/components/ui/calendar';
import { CardAction, CardContent, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemHeader, ItemTitle } from '@/components/ui/item';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useClinicStore } from '@/hooks/clinic';
import { useProfessionalColors, useProfessionalStore } from '@/hooks/professionals';
import { useIsMobile } from '@/hooks/use-mobile';
import { AgendaDaysToShow, EventGap, EventHeight, WeekCellsHeight } from '@/lib/config/calendar.config';
import { addHoursToDate, eventColors } from '@/lib/helpers/calendar.helper';
import { formatDate } from '@/lib/helpers/formatDate.helper';
import { capitalizeString, getEventColorByProfessional } from '@/lib/helpers/formatter.helper';
import { t } from '@/lib/helpers/translate.helper';
import type { CalendarView, EventColor, PartialSchedule } from '@/lib/interfaces/schedule.interface';
import { scheduleTimeSchema } from '@/lib/interfaces/schemas/schedule.schema';
import { cn } from '@/lib/utils/cn.util';
import { useClinicApi } from '@/query/clinic';
import { useProfessionalsQuery } from '@/query/professionals';
import { useUserQuery } from '@/query/user';
import { AgendaView } from './@components/agenda-view';
import { CalendarDndProvider } from './@components/calendar-dnd-provider';
import { DayView } from './@components/day-view';
import { MonthView } from './@components/month-view';
import { TimeUpdateDialog } from './@components/time-update-dialog';
import { WeekView } from './@components/week-view';
import { viewDictionary } from './@consts/schedule.consts';
import { useScheduleApi } from './@hooks/use-schedule-api';
import type { CustomDateRange } from './@interface/schedule.interface';
import { computeUpcomingPerProfessional } from './@utils/schedule.utils';

export const Route = createFileRoute('/_private/schedule/')({
  component: SchedulePage,
  staticData: {
    title: t('agenda'),
    description: t('agenda.description'),
  },
});

function SchedulePage() {
  // Context hooks
  const isMobile = useIsMobile();

  // Zustand hooks
  const { selectedRoom, setSelectedRoom, getRoomName: getRoomNameUtil } = useClinicStore();
  const professionalStore = useProfessionalStore();
  const { setColor: setProfessionalColor, clearColor: clearProfessionalColor } = useProfessionalColors();

  // Query hooks
  const { data: user } = useUserQuery();
  const { data: clinic } = useClinicApi();
  const { data: professionals } = useProfessionalsQuery();

  // Derived values
  const getRoomName = (id: string | undefined) => getRoomNameUtil(clinic, id);
  const getProfessionalName = (id: string | undefined) => professionalStore.getName(professionals, id);
  const getProfessionalImage = (id: string | undefined) => professionalStore.getImage(professionals, id);

  // useState
  const [currentDate, setCurrentDate] = useState(new Date());
  const [customDateRange, setCustomDateRange] = useState<CustomDateRange | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<PartialSchedule | null>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isConfirmTimeUpdateDialogOpen, setIsConfirmTimeUpdateDialogOpen] = useState(false);
  const [pendingEventUpdate, setPendingEventUpdate] = useState<PartialSchedule | null>(null);
  const [selectedRoomID, setSelectedRoomID] = useState('');
  const [view, setView] = useState<CalendarView>('week');

  // Route-specific API hook (events state + query + mutation)
  const { events, setEvents, startDate, endDate, updateScheduleTime, getProfessionalColor } = useScheduleApi({
    currentDate,
    view,
    customDateRange,
    selectedRoomID,
  });

  // useMemo
  const headerTitle = useMemo(() => {
    if (isMobile) return formatDate(currentDate, 'MMMM');
    switch (view) {
      case 'week': {
        const startWeek = startOfWeek(currentDate, { weekStartsOn: 0 });
        const endWeek = endOfWeek(currentDate, { weekStartsOn: 0 });
        if (isSameMonth(startWeek, endWeek)) return formatDate(startWeek, 'MMMM yyyy');
        return `${formatDate(startWeek, 'MMM')} - ${formatDate(endWeek, 'MMM yyyy')}`;
      }
      case 'agenda': {
        if (customDateRange) {
          if (isSameMonth(customDateRange.from, customDateRange.to)) return formatDate(customDateRange.from, 'MMMM yyyy');
          return `${formatDate(customDateRange.from, 'MMM')} - ${formatDate(customDateRange.to, 'MMM yyyy')}`;
        }
        const endAgenda = addDays(currentDate, AgendaDaysToShow - 1);
        if (isSameMonth(currentDate, endAgenda)) return formatDate(currentDate, 'MMMM yyyy');
        return `${formatDate(currentDate, 'MMM')} - ${formatDate(endAgenda, 'MMM yyyy')}`;
      }
      default:
        return formatDate(currentDate, 'MMMM yyyy');
    }
  }, [currentDate, view, customDateRange, isMobile]);

  const uniqueProfessionalIds = useMemo(() => {
    const allIds = events.map((event) => event.Professional).filter(Boolean);
    return Array.from(new Set(allIds));
  }, [events]);

  const upcomingPerProfessional = useMemo(() => computeUpcomingPerProfessional(events), [events]);

  const weekdayShortLabels = useMemo(() => {
    const sunday = new Date(2024, 0, 7);
    return Array.from({ length: 7 }, (_, i) => formatDate(addDays(sunday, i), 'EEE'));
  }, []);

  // useEffect
  useEffect(() => {
    if (selectedRoom) setSelectedRoomID(selectedRoom);
  }, [selectedRoom]);

  useEffect(() => {
    if (view !== 'agenda') setCustomDateRange(null);
  }, [view]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const avoidHotKey =
        isEventDialogOpen ||
        isConfirmTimeUpdateDialogOpen ||
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable);
      if (avoidHotKey) return;
      switch (e.key.toLowerCase()) {
        case 'm':
          setView('month');
          break;
        case 's':
          setView('week');
          break;
        case 'd':
          setView('day');
          break;
        case 'a':
          setView('agenda');
          break;
        case 'o':
        case 'i':
          setIsSidebarOpen(!isSidebarOpen);
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEventDialogOpen, isConfirmTimeUpdateDialogOpen, isSidebarOpen]);

  // Handlers
  const handlePrevious = () => {
    if (view === 'month') setCurrentDate(subMonths(currentDate, 1));
    else if (view === 'week') setCurrentDate(subWeeks(currentDate, 1));
    else if (view === 'day') setCurrentDate(addDays(currentDate, -1));
    else if (view === 'agenda') setCurrentDate(addDays(currentDate, -AgendaDaysToShow));
  };

  const handleNext = () => {
    if (view === 'month') setCurrentDate(addMonths(currentDate, 1));
    else if (view === 'week') setCurrentDate(addWeeks(currentDate, 1));
    else if (view === 'day') setCurrentDate(addDays(currentDate, 1));
    else if (view === 'agenda') setCurrentDate(addDays(currentDate, AgendaDaysToShow));
  };

  const handleEventCreate = (start: Date) => {
    const minutes = start.getMinutes();
    const remainder = minutes % 15;
    if (remainder !== 0) {
      if (remainder < 7.5) start.setMinutes(minutes - remainder);
      else start.setMinutes(minutes + (15 - remainder));
      start.setSeconds(0);
      start.setMilliseconds(0);
    }
    setSelectedEvent({
      _id: '',
      title: '',
      start,
      end: addHoursToDate(start, 1),
      allDay: false,
      Patient: '',
      Professional: '',
      Room: selectedRoomID,
      status: 'pending',
    });
    setIsEventDialogOpen(true);
  };

  const handleEventSave = (event: PartialSchedule) => {
    if (event._id && event.color) {
      setEvents(events.map((e) => (e._id === event._id ? { ...event, color: getEventColorByProfessional(event.Professional || '', getProfessionalColor, event.status) } : e)));
      toast(t('toast.appointment.updated'), { description: formatDate(event.start, 'd MMM yyyy') });
    } else {
      setEvents([
        ...events,
        {
          ...event,
          _id: event._id || Math.random().toString(36).substring(2, 11),
          color: getEventColorByProfessional(event.Professional || '', getProfessionalColor, event.status),
        },
      ]);
      toast(t('toast.appointment.added'), { description: formatDate(event.start, 'd MMM yyyy') });
    }
    setIsEventDialogOpen(false);
    setSelectedEvent(null);
  };

  const handleEventSelect = (event: PartialSchedule) => {
    setSelectedEvent(event);
    setIsEventDialogOpen(true);
  };

  const handleEventUpdate = (updatedEvent: PartialSchedule) => {
    setPendingEventUpdate(updatedEvent);
    setIsConfirmTimeUpdateDialogOpen(true);
  };

  const handleEventDelete = (eventId: string) => {
    const deletedEvent = events.find((e) => e._id === eventId);
    setEvents(events.filter((event) => event._id !== eventId));
    setIsEventDialogOpen(false);
    setSelectedEvent(null);
    if (deletedEvent) {
      toast(`"${deletedEvent.title}" ${t('removed')}`, { description: formatDate(deletedEvent.start, 'd MMM yyy') });
    }
  };

  const handleConfirmTimeUpdate = async (confirmedEvent: PartialSchedule) => {
    try {
      const validatedData = scheduleTimeSchema.parse({
        start: new Date(confirmedEvent.start).toISOString(),
        end: new Date(confirmedEvent.end).toISOString(),
      });
      await updateScheduleTime.mutateAsync({ id: confirmedEvent._id, data: validatedData });
      setEvents(
        events.map((event) =>
          event._id === confirmedEvent._id
            ? { ...confirmedEvent, color: getEventColorByProfessional(confirmedEvent.Professional || '', getProfessionalColor, confirmedEvent.status) }
            : event,
        ),
      );
      toast(t('toast.appointment.time.updated'), { description: formatDate(confirmedEvent.start, 'dd/MM/yyyy HH:mm') });
    } catch {
      // error handled globally via MutationCache.onError
    } finally {
      setIsConfirmTimeUpdateDialogOpen(false);
      setPendingEventUpdate(null);
    }
  };

  const handleColorChange = (professionalID: string, color: EventColor) => {
    setProfessionalColor(professionalID, color);
    setEvents(
      events.map((event) =>
        event.Professional === professionalID ? { ...event, color: getEventColorByProfessional(event.Professional, getProfessionalColor, event.status) } : event,
      ),
    );
    toast.success(t('toast.color.updated'));
  };

  const handleRemoveColor = (professionalId: string | undefined) => {
    if (!professionalId) return;
    clearProfessionalColor(professionalId);
    setEvents(
      events.map((event) =>
        event.Professional === professionalId ? { ...event, color: getEventColorByProfessional(event.Professional, getProfessionalColor, event.status) } : event,
      ),
    );
    toast.success(t('toast.color.from.status'));
  };

  const handleRangeSelect = (range: { from: Date | undefined; to?: Date | undefined } | undefined) => {
    if (range?.from && range?.to) {
      setCustomDateRange({ from: range.from, to: range.to });
      setView('agenda');
      setCurrentDate(range.from);
    } else if (range?.from) {
      setCurrentDate(range.from);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setCurrentDate(date);
      if (view === 'month') setView('week');
    }
  };

  return (
    <div className="flex h-full w-full flex-col gap-6 rounded-lg border bg-background py-6 pb-14 text-card-foreground md:pb-0">
      <div className="flex items-end justify-between gap-2 px-4 md:px-6">
        <ItemContent className="flex-row items-baseline gap-2 text-sky-blue text-xl dark:text-primary-blue">
          <CardTitle>{String(currentDate.getDate()).padStart(2, '0')}</CardTitle>
          <CardTitle className="leading-none">{weekdayShortLabels[currentDate.getDay()]}</CardTitle>
          <ItemDescription className="leading-none">{headerTitle}</ItemDescription>
        </ItemContent>
        <CardAction>
          <ButtonGroup>
            <Button
              variant="outline"
              size={isMobile ? 'default' : 'sm'}
              onClick={handlePrevious}
              aria-label={t('pagination.previous')}
              className="rounded-none rounded-l-md border-r-0 px-2"
            >
              <Left className="size-5" aria-hidden="true" />
            </Button>
            <Button variant="outline" size={isMobile ? 'default' : 'sm'} onClick={() => setCurrentDate(new Date())} className="hidden rounded-none border-x-0 px-1 md:block">
              {t('today')}
            </Button>
            <Button
              variant="outline"
              size={isMobile ? 'default' : 'sm'}
              onClick={handleNext}
              aria-label={t('pagination.next')}
              className="rounded-none rounded-r-md border-l-0 px-2"
            >
              <Right className="size-5" aria-hidden="true" />
            </Button>
          </ButtonGroup>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size={isMobile ? 'default' : 'sm'} className="gap-1 px-2">
                <span>
                  <span className="min-[480px]:hidden" aria-hidden="true">
                    {viewDictionary[view].charAt(0).toUpperCase()}
                  </span>
                  <span className="max-[479px]:sr-only">{capitalizeString(viewDictionary[view])}</span>
                </span>
                <Down className="-ms-1 size-5" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-32">
              <DropdownMenuItem onClick={() => setView('month')}>{t('month')}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setView('week')}>{t('week')}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setView('day')}>{t('day')}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setView('agenda')}>{t('agenda')}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Select
            value={selectedRoomID}
            onValueChange={(value) => {
              setSelectedRoom(value);
              setSelectedRoomID(value);
              setEvents([]);
            }}
          >
            <SelectTrigger
              size={isMobile ? 'default' : 'sm'}
              aria-invalid={!selectedRoomID}
              aria-required
              className={cn('px-2', !selectedRoomID && 'data-placeholder:text-destructive [&_svg]:text-destructive')}
            >
              <SelectValue placeholder={t('select.room')} />
            </SelectTrigger>
            <SelectContent>
              {user?.rooms?.map((room: any) => (
                <SelectItem key={room._id} value={room._id}>
                  {getRoomName(room._id)}
                </SelectItem>
              ))}
              {user?.role?.includes('assistant') && <SelectItem value="all">{t('all.rooms')}</SelectItem>}
            </SelectContent>
          </Select>
          {!isMobile && (
            <Button size="sm" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <Grid className="size-4" />
            </Button>
          )}
          <Button
            size={isMobile ? 'default' : 'sm'}
            className="px-2"
            onClick={() => {
              setSelectedEvent(null);
              setIsEventDialogOpen(true);
            }}
          >
            <Add className="size-4 md:-ms-1" aria-hidden="true" />
            <span className="sr-only md:not-sr-only">{t('add')}</span>
          </Button>
        </CardAction>
      </div>

      <div className={cn('flex transition-all duration-300 ease-in-out', isMobile ? 'flex-col gap-1' : 'gap-3')}>
        <CardContent
          className="flex flex-1 flex-col p-0 pb-4"
          style={
            {
              '--event-height': `${EventHeight}px`,
              '--event-gap': `${EventGap}px`,
              '--week-cells-height': `${WeekCellsHeight}px`,
            } as React.CSSProperties
          }
        >
          <CalendarDndProvider onEventUpdate={handleEventUpdate}>
            <div className={view === 'month' ? '' : 'hidden'}>
              <MonthView currentDate={currentDate} events={events} onEventSelect={handleEventSelect} onEventCreate={handleEventCreate} />
            </div>
            <div className={view === 'week' ? '' : 'hidden'}>
              <WeekView currentDate={currentDate} events={events} onEventSelect={handleEventSelect} onEventCreate={handleEventCreate} />
            </div>
            <div className={view === 'day' ? '' : 'hidden'}>
              <DayView currentDate={currentDate} events={events} onEventSelect={handleEventSelect} onEventCreate={handleEventCreate} />
            </div>
            <div className={view === 'agenda' ? '' : 'hidden'}>
              <AgendaView currentDate={currentDate} events={events} onEventSelect={handleEventSelect} />
            </div>
            <ScheduleDialog
              event={selectedEvent}
              open={isEventDialogOpen}
              onOpenChange={setIsEventDialogOpen}
              onClose={() => {
                setIsEventDialogOpen(false);
                setSelectedEvent(null);
              }}
              onSave={handleEventSave}
              onDelete={handleEventDelete}
            />
          </CalendarDndProvider>

          <TimeUpdateDialog
            isOpen={isConfirmTimeUpdateDialogOpen}
            onClose={() => setIsConfirmTimeUpdateDialogOpen(false)}
            pendingEvent={pendingEventUpdate}
            onConfirm={handleConfirmTimeUpdate}
          />
        </CardContent>

        <CardContent
          className={cn('flex flex-col gap-4 md:self-start', isMobile ? 'w-full' : 'w-72', isMobile ? 'opacity-100' : isSidebarOpen ? 'opacity-100' : 'opacity-0 md:hidden')}
        >
          {/* Mini Calendar Navigation */}
          <ItemContent className="w-full gap-3">
            {view === 'day' && (
              <Calendar
                mode="single"
                selected={currentDate}
                onSelect={handleDateSelect}
                className="w-full rounded-md"
                month={currentDate}
                captionLayout="dropdown"
                onMonthChange={setCurrentDate}
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
                onMonthChange={setCurrentDate}
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
                onMonthChange={setCurrentDate}
              />
            )}
            <ItemHeader className="px-4">
              <ItemActions className="w-2/3">
                <Button variant="outline" size="sm" onClick={handlePrevious} className="w-1/3 rounded-none rounded-l-md border-r-0 px-2">
                  <Left className="size-5" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())} className="w-1/3 rounded-none border-x-0">
                  {t('today')}
                </Button>
                <Button variant="outline" size="sm" onClick={handleNext} className="w-1/3 rounded-none rounded-r-md border-l-0 px-2">
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
                  <DropdownMenuItem onClick={() => setView('month')}>{t('month')}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setView('week')}>{t('week')}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setView('day')}>{t('day')}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setView('agenda')}>{t('agenda')}</DropdownMenuItem>
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedEvent(doc.nextEvent || null);
                        setIsEventDialogOpen(true);
                      }}
                      className="gap-1 transition-colors"
                    >
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
                      if (color && profId) handleColorChange(profId, color);
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
                    <Button variant="outline" size="sm" onClick={() => handleRemoveColor(profId)} className="size-8 p-0">
                      <Cross className="size-4" />
                    </Button>
                  )}
                </Item>
              );
            })}
          </ItemGroup>
        </CardContent>
      </div>
    </div>
  );
}
