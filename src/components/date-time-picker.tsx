import { addHours, endOfDay, format, parse, set, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { CalendarIcon, Clock } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EndHour, StartHour } from '@/lib/consts/calendar.constants';
import { cn } from '@/lib/utils';

interface DateTimePickerProps {
  startDate?: Date;
  endDate?: Date;
  startTime?: string;
  endTime?: string;
  allDay?: boolean;
  onChange: (data: { startISO: string; endISO: string; allDay: boolean }) => void;
  disabled?: boolean;
}

export default function DateTimePicker({ startDate, endDate, startTime, endTime, allDay = false, onChange, disabled = false }: DateTimePickerProps) {
  const [internalStartDate, setInternalStartDate] = useState<Date | undefined>(startDate);
  const [internalEndDate, setInternalEndDate] = useState<Date | undefined>(endDate);
  const [internalStartTime, setInternalStartTime] = useState<string | undefined>(startTime);
  const [internalEndTime, setInternalEndTime] = useState<string | undefined>(endTime);
  const [internalAllDay, setInternalAllDay] = useState<boolean>(allDay);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  const timeOptions = useMemo(() => {
    const options: { value: string; label: string }[] = [];
    for (let hour = StartHour; hour <= EndHour; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        const value = `${formattedHour}:${formattedMinute}`;
        const date = new Date(2000, 0, 1, hour, minute);
        const label = format(date, 'HH:mm');
        options.push({ value, label });
      }
    }
    return options;
  }, []);

  useEffect(() => {
    setInternalStartDate(startDate);
    setInternalEndDate(endDate);
    setInternalStartTime(startTime);
    setInternalEndTime(endTime);
    setInternalAllDay(allDay);
  }, [startDate, endDate, startTime, endTime, allDay]);

  const notifyChange = (
    updates: Partial<{
      startDate: Date | undefined;
      endDate: Date | undefined;
      startTime: string | undefined;
      endTime: string | undefined;
      allDay: boolean;
    }>,
  ) => {
    const finalStartDate = updates.startDate !== undefined ? updates.startDate : internalStartDate;
    const finalEndDate = updates.endDate !== undefined ? updates.endDate : internalEndDate;
    const finalStartTime = updates.startTime !== undefined ? updates.startTime : internalStartTime;
    const finalEndTime = updates.endTime !== undefined ? updates.endTime : internalEndTime;
    const finalAllDay = updates.allDay !== undefined ? updates.allDay : internalAllDay;

    const startISO = (() => {
      const base = finalStartDate ?? new Date();
      if (finalAllDay) return startOfDay(base).toISOString();
      const time = finalStartTime ?? '09:00';
      const parsed = parse(time, 'HH:mm', base);
      const normalized = set(parsed, { seconds: 0, milliseconds: 0 });
      return normalized.toISOString();
    })();

    const endISO = (() => {
      const base = finalEndDate ?? finalStartDate ?? new Date();
      if (finalAllDay) return endOfDay(base).toISOString();
      const time = finalEndTime ?? '10:00';
      const parsed = parse(time, 'HH:mm', base);
      const normalized = set(parsed, { seconds: 0, milliseconds: 0 });
      return normalized.toISOString();
    })();

    const newData = {
      startDate: finalStartDate,
      endDate: finalEndDate,
      startTime: finalStartTime,
      endTime: finalEndTime,
      allDay: finalAllDay,
      startISO,
      endISO,
    };

    onChange(newData);
  };

  const handleStartDateChange = (date: Date | undefined) => {
    setInternalStartDate(date);

    if (date && (!internalEndDate || date > internalEndDate)) {
      setInternalEndDate(date);
      notifyChange({ startDate: date, endDate: date });
    } else {
      notifyChange({ startDate: date });
    }
    setStartDateOpen(false);
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setInternalEndDate(date);
    notifyChange({ endDate: date });
    setEndDateOpen(false);
  };

  const handleStartTimeChange = (time: string) => {
    setInternalStartTime(time);

    const start = parse(time, 'HH:mm', new Date(2000, 0, 1));
    let candidate = addHours(start, 1);
    if (candidate.getHours() > EndHour) {
      candidate = set(candidate, { hours: EndHour, minutes: 0, seconds: 0, milliseconds: 0 });
    }
    const newEndTime = format(candidate, 'HH:mm');
    setInternalEndTime(newEndTime);

    notifyChange({ startTime: time, endTime: newEndTime });
  };

  const handleEndTimeChange = (time: string) => {
    setInternalEndTime(time);
    notifyChange({ endTime: time });
  };

  const handleAllDayChange = (checked: boolean) => {
    setInternalAllDay(checked);

    if (checked) {
      notifyChange({ allDay: checked, startTime: undefined, endTime: undefined });
    } else {
      const defaultStart = internalStartTime || '09:00';
      const start = parse(defaultStart, 'HH:mm', new Date(2000, 0, 1));
      let candidate = internalEndTime ? parse(internalEndTime, 'HH:mm', new Date(2000, 0, 1)) : addHours(start, 1);
      if (candidate.getHours() > EndHour) {
        candidate = set(candidate, { hours: EndHour, minutes: 0, seconds: 0, milliseconds: 0 });
      }
      const defaultEnd = format(candidate, 'HH:mm');
      setInternalStartTime(defaultStart);
      setInternalEndTime(defaultEnd);
      notifyChange({ allDay: checked, startTime: defaultStart, endTime: defaultEnd });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex w-full items-end gap-2 md:gap-4">
        <div className={cn('md:max-w-xs', internalAllDay ? 'w-full' : 'w-5/7')}>
          <Label htmlFor="start-date" className="font-normal leading-8">
            Data
          </Label>
          <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
            <PopoverTrigger asChild>
              <Button
                id="start-date"
                variant="outline"
                disabled={disabled}
                className={cn('group w-full justify-between px-3 focus-visible:outline-[3px]', !internalStartDate && 'text-muted-foreground')}
              >
                <span className={cn('truncate', !internalStartDate && 'text-muted-foreground')}>
                  {internalStartDate ? format(internalStartDate, 'PPP', { locale: ptBR }) : 'Selecione a data de início'}
                </span>
                <CalendarIcon className="size-4 shrink-0" aria-hidden="true" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="start">
              <Calendar mode="single" selected={internalStartDate} defaultMonth={internalStartDate} onSelect={handleStartDateChange} />
            </PopoverContent>
          </Popover>
        </div>

        {!internalAllDay && (
          <div className="w-2/7 md:max-w-44">
            <Label className="font-normal leading-8">Início</Label>
            <Select value={internalStartTime || ''} onValueChange={handleStartTimeChange} disabled={disabled}>
              <SelectTrigger className="w-full gap-1 overflow-x-hidden">
                <Clock className="hidden size-4 stroke-2 md:block" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="flex w-full items-end gap-2 md:gap-4">
        <div className={cn('md:max-w-xs', internalAllDay ? 'w-full' : 'w-5/7')}>
          <Label htmlFor="end-date" className="font-normal leading-8">
            Data Final
          </Label>
          <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
            <PopoverTrigger asChild>
              <Button
                id="end-date"
                variant="outline"
                disabled={disabled}
                className={cn('group w-full justify-between px-3 focus-visible:outline-[3px]', !internalEndDate && 'text-muted-foreground')}
              >
                <span className={cn('truncate', !internalEndDate && 'text-muted-foreground')}>
                  {internalEndDate ? format(internalEndDate, 'PPP', { locale: ptBR }) : 'Selecione a data final'}
                </span>
                <CalendarIcon className="size-4 shrink-0" aria-hidden="true" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="start">
              <Calendar
                mode="single"
                selected={internalEndDate}
                defaultMonth={internalEndDate}
                disabled={(date) => (internalStartDate ? date < internalStartDate : false)}
                onSelect={handleEndDateChange}
              />
            </PopoverContent>
          </Popover>
        </div>

        {!internalAllDay && (
          <div className="w-2/7 md:max-w-44">
            <Label className="font-normal leading-8">Término</Label>
            <Select value={internalEndTime || ''} onValueChange={handleEndTimeChange} disabled={disabled}>
              <SelectTrigger className="w-full gap-1 overflow-x-hidden">
                <Clock className="hidden size-4 stroke-2 md:block" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 p-3">
        <Checkbox id="all-day" checked={internalAllDay} onCheckedChange={handleAllDayChange} disabled={disabled} />
        <Label htmlFor="all-day">Dia inteiro</Label>
      </div>
    </div>
  );
}
