import { createFileRoute } from '@tanstack/react-router';
import { addDays, addMonths, addWeeks, endOfDay, endOfMonth, endOfWeek, format, isSameMonth, startOfDay, startOfMonth, startOfWeek, subMonths, subWeeks } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import Add from '@/components/icons/Add.Icon';
import Cross from '@/components/icons/Cross.Icon';
import Down from '@/components/icons/Down.Icon';
import Eye from '@/components/icons/Eye.Icon';
import Grid from '@/components/icons/Grid.Icon';
import Left from '@/components/icons/Left.Icon';
import Right from '@/components/icons/Right.Icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useClinicStore } from '@/hooks/clinic';
import { useProfessionalColors, useProfessionalStore } from '@/hooks/professionals';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUserStore } from '@/hooks/user';
import { AgendaDaysToShow, EventGap, EventHeight, WeekCellsHeight } from '@/lib/config/calendar.config';
import { addHoursToDate, eventColors } from '@/lib/helpers/calendar.helper';
import { capitalizeString, extractDate, getEventColorByProfessional } from '@/lib/helpers/formatter.helper';
import type { CalendarView, EventColor, PartialSchedule } from '@/lib/interfaces/schedule.interface';
import { scheduleTimeSchema } from '@/lib/interfaces/schemas/schedule.schema';
import { cn } from '@/lib/utils/cn.util';
import { useClinicApi } from '@/query/clinic';
import { useProfessionalsQuery } from '@/query/professionals';
import { useScheduleQuery, useUpdateScheduleTime } from '@/query/schedule';
import { useUserQuery } from '@/query/user';
import { AgendaView } from './@components/agenda-view';
import { CalendarDndProvider } from './@components/calendar-dnd-context';
import { DayView } from './@components/day-view';
import { EventDialog } from './@components/event-dialog';
import { MonthView } from './@components/month-view';
import { TimeUpdateDialog } from './@components/time-update-dialog';
import { WeekView } from './@components/week-view';

export const Route = createFileRoute('/_private/schedule/')({
  component: SchedulePage,
  staticData: {
    title: 'Agenda',
    description: 'Gestão de horários e calendário clínico multidisciplinar.',
  },
});

const viewDictionary: Record<CalendarView, string> = {
  month: 'Mês',
  week: 'Semana',
  day: 'Dia',
  agenda: 'Agenda',
};

function SchedulePage() {
  const isMobile = useIsMobile();
  const { selectedRoom, setSelectedRoom } = useUserStore();
  const { data: user } = useUserQuery();
  const { data: clinic } = useClinicApi();
  const { getRoomName: getRoomNameUtil } = useClinicStore();
  const getRoomName = (id: string | undefined) => getRoomNameUtil(clinic, id);
  const { data: professionals } = useProfessionalsQuery();
  const professionalStore = useProfessionalStore();
  const { getColor: getProfessionalColor, setColor: setProfessionalColor, clearColor: clearProfessionalColor } = useProfessionalColors();
  const getProfessionalName = (id: string | undefined) => professionalStore.getName(professionals, id);
  const getProfessionalImage = (id: string | undefined) => professionalStore.getImage(professionals, id);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [customDateRange, setCustomDateRange] = useState<{ from: Date; to: Date } | null>(null);
  const [events, setEvents] = useState<PartialSchedule[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<PartialSchedule | null>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isConfirmTimeUpdateDialogOpen, setIsConfirmTimeUpdateDialogOpen] = useState(false);
  const [pendingEventUpdate, setPendingEventUpdate] = useState<PartialSchedule | null>(null);

  const [selectedRoomID, setSelectedRoomID] = useState('');
  useEffect(() => {
    if (selectedRoom) {
      setSelectedRoomID(selectedRoom);
    }
  }, [selectedRoom]);

  const [view, setView] = useState<CalendarView>('week');

  useEffect(() => {
    if (view !== 'agenda') setCustomDateRange(null);
  }, [view]);

  const getDateRange = useCallback(() => {
    if (customDateRange && view === 'agenda') {
      return { startDate: startOfDay(customDateRange.from), endDate: endOfDay(customDateRange.to) };
    }
    const startDate = startOfDay(currentDate);
    const endDate = endOfDay(currentDate);
    if (view === 'month') return { startDate: startOfMonth(startDate), endDate: endOfMonth(endDate) };
    if (view === 'week') return { startDate: startOfWeek(startDate, { weekStartsOn: 1 }), endDate: endOfWeek(endDate, { weekStartsOn: 1 }) };
    if (view === 'day' || view === 'agenda') return { startDate, endDate: addDays(endDate, 1) };
    return { startDate, endDate };
  }, [currentDate, view, customDateRange]);

  const { startDate, endDate } = getDateRange();
  const { data: scheduleData } = useScheduleQuery({
    startDate,
    endDate,
    roomID: selectedRoomID,
  });

  useEffect(() => {
    if (scheduleData) {
      const eventsWithColors = scheduleData.map((event) => ({
        ...event,
        color: getEventColorByProfessional(event.Professional || '', getProfessionalColor, event.status),
      }));
      setEvents(eventsWithColors);
    }
  }, [scheduleData, getProfessionalColor]);

  const updateScheduleTime = useUpdateScheduleTime();

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

  const handleEventCreate = (start: Date) => {
    const minutes = start.getMinutes();
    const remainder = minutes % 15;
    if (remainder !== 0) {
      if (remainder < 7.5) start.setMinutes(minutes - remainder);
      else start.setMinutes(minutes + (15 - remainder));
      start.setSeconds(0);
      start.setMilliseconds(0);
    }

    const newEvent: PartialSchedule = {
      _id: '',
      title: '',
      start,
      end: addHoursToDate(start, 1),
      allDay: false,
      Patient: '',
      Professional: '',
      Room: selectedRoomID,
      status: 'pending',
    };
    setSelectedEvent(newEvent);
    setIsEventDialogOpen(true);
  };

  const handleEventSave = (event: PartialSchedule) => {
    if (event._id && event.color) {
      const updatedEvent = {
        ...event,
        color: getEventColorByProfessional(event.Professional || '', getProfessionalColor, event.status),
      };
      setEvents(events.map((e) => (e._id === event._id ? updatedEvent : e)));
      toast('Agendamento atualizado', { description: format(new Date(event.start), 'd MMM yyyy', { locale: ptBR }) });
    } else {
      const newEventWithColor = {
        ...event,
        _id: event._id || Math.random().toString(36).substring(2, 11),
        color: getEventColorByProfessional(event.Professional || '', getProfessionalColor, event.status),
      };
      setEvents([...events, newEventWithColor]);
      toast('Agendamento adicionado', { description: format(new Date(event.start), 'd MMM yyyy', { locale: ptBR }) });
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
      toast(`"${deletedEvent.title}" excluído`, { description: format(new Date(deletedEvent.start), 'd MMM yyy', { locale: ptBR }) });
    }
  };

  const handleConfirmTimeUpdate = async (confirmedEvent: PartialSchedule) => {
    try {
      const timeData = {
        start: new Date(confirmedEvent.start).toISOString(),
        end: new Date(confirmedEvent.end).toISOString(),
      };
      const validatedData = scheduleTimeSchema.parse(timeData);
      await updateScheduleTime.mutateAsync({ id: confirmedEvent._id, data: validatedData });

      const updatedEvent = {
        ...confirmedEvent,
        color: getEventColorByProfessional(confirmedEvent.Professional || '', getProfessionalColor, confirmedEvent.status),
      };
      setEvents(events.map((event) => (event._id === confirmedEvent._id ? updatedEvent : event)));
      toast('Horário do agendamento atualizado', { description: format(new Date(confirmedEvent.start), 'dd/MM/yyyy HH:mm', { locale: ptBR }) });
    } catch (e: any) {
      toast.error('Erro ao atualizar horário', { description: e.message });
    } finally {
      setIsConfirmTimeUpdateDialogOpen(false);
      setPendingEventUpdate(null);
    }
  };

  const headerTitle = useMemo(() => {
    if (isMobile) return format(currentDate, 'MMMM', { locale: ptBR });
    switch (view) {
      case 'week': {
        const startWeek = startOfWeek(currentDate, { weekStartsOn: 0 });
        const endWeek = endOfWeek(currentDate, { weekStartsOn: 0 });
        if (isSameMonth(startWeek, endWeek)) return format(startWeek, 'MMMM yyyy', { locale: ptBR });
        return `${format(startWeek, 'MMM', { locale: ptBR })} - ${format(endWeek, 'MMM yyyy', { locale: ptBR })}`;
      }
      case 'agenda': {
        if (customDateRange) {
          if (isSameMonth(customDateRange.from, customDateRange.to)) return format(customDateRange.from, 'MMMM yyyy', { locale: ptBR });
          return `${format(customDateRange.from, 'MMM', { locale: ptBR })} - ${format(customDateRange.to, 'MMM yyyy', { locale: ptBR })}`;
        }
        const endAgenda = addDays(currentDate, AgendaDaysToShow - 1);
        if (isSameMonth(currentDate, endAgenda)) return format(currentDate, 'MMMM yyyy', { locale: ptBR });
        return `${format(currentDate, 'MMM', { locale: ptBR })} - ${format(endAgenda, 'MMM yyyy', { locale: ptBR })}`;
      }
      default:
        return format(currentDate, 'MMMM yyyy', { locale: ptBR });
    }
  }, [currentDate, view, customDateRange, isMobile]);

  const handleColorChange = (professionalID: string, color: EventColor) => {
    setProfessionalColor(professionalID, color);
    const updatedEvents = events.map((event) =>
      event.Professional === professionalID ? { ...event, color: getEventColorByProfessional(event.Professional, getProfessionalColor, event.status) } : event,
    );
    setEvents(updatedEvents);
    toast.success('Cor atualizada');
  };

  const handleRemoveColor = (professionalId: string | undefined) => {
    if (!professionalId) return;
    clearProfessionalColor(professionalId);
    const updatedEvents = events.map((event) =>
      event.Professional === professionalId ? { ...event, color: getEventColorByProfessional(event.Professional, getProfessionalColor, event.status) } : event,
    );
    setEvents(updatedEvents);
    toast.success('Cor baseada no status');
  };

  const uniqueProfessionalIds = useMemo(() => {
    const allIds = events.map((event) => event.Professional).filter(Boolean);
    return Array.from(new Set(allIds));
  }, [events]);

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
    <Card asPage className="flex w-full flex-col-reverse pb-14 md:flex-col md:pb-0">
      <CardHeader className="fixed right-1 bottom-16 left-1 z-40 flex flex-row items-center justify-between py-4 md:static md:right-auto md:left-auto md:z-auto">
        <div className="flex flex-col items-baseline md:flex-row md:gap-2">
          <CardTitle className="flex items-baseline gap-2 text-sky-blue leading-1 dark:text-primary-blue">
            <span className="font-bold text-3xl tabular-nums">{String(currentDate.getDate()).padStart(2, '0')}</span>
            <span className="font-bold text-xl">{['dom.', 'seg.', 'ter.', 'qua.', 'qui.', 'sex.', 'sáb.'][currentDate.getDay()]}</span>
          </CardTitle>
          <p className="font-mono text-muted-foreground text-sm leading-1 sm:text-lg md:text-xl">{headerTitle}</p>
        </div>
        <div className="flex items-center justify-between gap-1 md:gap-4">
          <div className="flex items-center justify-between gap-1 md:gap-4 lg:flex-none">
            <div className="flex items-center">
              <div className="relative flex items-center md:items-stretch">
                <Button variant="outline" size={isMobile ? 'default' : 'sm'} onClick={handlePrevious} aria-label="Anterior" className="rounded-none rounded-l-md border-r-0 px-2">
                  <Left className="size-5" aria-hidden="true" />
                </Button>
                <Button variant="outline" size={isMobile ? 'default' : 'sm'} onClick={() => setCurrentDate(new Date())} className="hidden rounded-none border-x-0 md:block">
                  Hoje
                </Button>
                <Button variant="outline" size={isMobile ? 'default' : 'sm'} onClick={handleNext} aria-label="Próximo" className="rounded-none rounded-r-md border-l-0 px-2">
                  <Right className="size-5" aria-hidden="true" />
                </Button>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size={isMobile ? 'default' : 'sm'} className="gap-1.5">
                  <span>
                    <span className="min-[480px]:hidden" aria-hidden="true">
                      {viewDictionary[view].charAt(0).toUpperCase()}
                    </span>
                    <span className="max-[479px]:sr-only">{capitalizeString(viewDictionary[view])}</span>
                  </span>
                  <Down className="-me-1 size-5" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-32">
                <DropdownMenuItem onClick={() => setView('month')}>Mês</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setView('week')}>Semana</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setView('day')}>Dia</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setView('agenda')}>Agenda</DropdownMenuItem>
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
              <SelectTrigger size={isMobile ? 'default' : 'sm'}>
                <SelectValue placeholder="Selecione uma sala" />
              </SelectTrigger>
              <SelectContent>
                {user?.rooms?.map((room: any) => (
                  <SelectItem key={room._id} value={room._id}>
                    {getRoomName(room._id)}
                  </SelectItem>
                ))}
                {user?.role?.includes('assistant') && <SelectItem value="all">Todas as salas</SelectItem>}
              </SelectContent>
            </Select>
            {!isMobile && (
              <Button variant="outline" size={isMobile ? 'default' : 'sm'} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                <Grid className="size-4" />
              </Button>
            )}
            <Button
              className="gap-1.5 max-[479px]:aspect-square max-[479px]:p-0!"
              size={isMobile ? 'default' : 'sm'}
              onClick={() => {
                setSelectedEvent(null);
                setIsEventDialogOpen(true);
              }}
            >
              <Add className="size-4" aria-hidden="true" />
              <span className="max-sm:sr-only">Adicionar</span>
            </Button>
          </div>
        </div>
      </CardHeader>

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
            <EventDialog
              event={selectedEvent}
              isOpen={isEventDialogOpen}
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
          <div className="flex w-full flex-col gap-3">
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
            <div className="flex w-full justify-between gap-2 px-4">
              <div className="flex w-2/3 items-center">
                <Button variant="outline" size="sm" onClick={handlePrevious} className="w-1/3 rounded-none rounded-l-md border-r-0 px-2">
                  <Left className="size-5" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())} className="w-1/3 rounded-none border-x-0">
                  Hoje
                </Button>
                <Button variant="outline" size="sm" onClick={handleNext} className="w-1/3 rounded-none rounded-r-md border-l-0 px-2">
                  <Right className="size-5" />
                </Button>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="w-1/3 justify-evenly">
                    <span className="overflow-hidden">{viewDictionary[view]}</span>
                    <Down className="-me-1 size-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-32">
                  <DropdownMenuItem onClick={() => setView('month')}>Mês</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setView('week')}>Semana</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setView('day')}>Dia</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setView('agenda')}>Agenda</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="flex w-full flex-col">
            {events.length === 0 ? (
              <div className="flex flex-col p-6">
                <p className="font-semibold">Próximas Consultas</p>
                <p className="text-muted-foreground text-sm">Nenhuma consulta agendada</p>
              </div>
            ) : (
              (() => {
                const now = new Date();
                const professionalEvents = new Map<string, PartialSchedule[]>();
                events.forEach((event) => {
                  if (new Date(event.start) > now && event.Professional) {
                    const list = professionalEvents.get(event.Professional) || [];
                    professionalEvents.set(event.Professional, [...list, event]);
                  }
                });
                const profNextEvents = Array.from(professionalEvents.entries()).map(([prof, profEvents]) => ({
                  Professional: prof,
                  nextEvent: profEvents.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())[0],
                }));

                return profNextEvents.map((doc) => (
                  <div key={doc.Professional} className="space-y-2 rounded-md p-4">
                    <div className="flex flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={getProfessionalImage(doc.Professional) || undefined} />
                          <AvatarFallback>{getProfessionalName(doc.Professional).slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <p className="text-sm">{getProfessionalName(doc.Professional)}</p>
                      </div>
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
                        <span className="text-muted-foreground text-xs tabular-nums">Ver</span>
                      </Button>
                    </div>
                    <div className="flex flex-row items-baseline gap-4">
                      <span className="font-bold text-xl text-yellow-500 tabular-nums dark:text-yellow-400">
                        {doc.nextEvent?.start ? extractDate(doc.nextEvent.start, 'hour') : '--:--'}
                      </span>
                      <span className="text-muted-foreground text-sm">{doc.nextEvent?.start ? extractDate(doc.nextEvent.start, '') : '--:--'}</span>
                    </div>
                  </div>
                ));
              })()
            )}
          </div>

          {/* Professional Color Manager */}
          <div className="flex w-full flex-col gap-4 px-2">
            {uniqueProfessionalIds.map((profId) => {
              const hasCustomColor = getProfessionalColor(profId);
              const displayColor = hasCustomColor ? eventColors.find((c) => c.value === hasCustomColor) : null;

              return (
                <CardContent key={profId} className="flex items-center justify-evenly gap-2 p-3 md:justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={getProfessionalImage(profId) || undefined} />
                      <AvatarFallback>{getProfessionalName(profId).slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="truncate font-semibold text-md leading-none">{getProfessionalName(profId).slice(0, 8)}</p>
                      <p className="truncate text-muted-foreground text-sm">{hasCustomColor ? displayColor?.label : 'Cor do status'}</p>
                    </div>
                  </div>
                  <Select
                    value={hasCustomColor || ''}
                    onValueChange={(color: EventColor) => {
                      if (color && profId) handleColorChange(profId, color);
                    }}
                  >
                    <SelectTrigger size="sm" className="w-30 truncate px-2">
                      <SelectValue placeholder="Cor" />
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
                </CardContent>
              );
            })}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
