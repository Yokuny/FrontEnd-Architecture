import { createFileRoute } from '@tanstack/react-router';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuShortcut, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Item, ItemContent, ItemDescription, ItemHeader, ItemTitle } from '@/components/ui/item';
import { MonthView } from './@components/Month';
import { WeekView } from './@components/Week';
import { useCalendarMaintenance } from './@hooks/use-calendar-maintenance';
import { capitalizeString } from './@utils/calendar.utils';

export const Route = createFileRoute('/_private/calendar-maintenance/')({
  component: CalendarMaintenancePage,
  beforeLoad: () => ({
    title: 'calendar.maintenance',
  }),
});

function CalendarMaintenancePage() {
  const { t } = useTranslation();
  const { currentDate, setCurrentDate, events, view, setView, isLoading, handlePrevious, handleNext, handleEventCreate, handleEventSelect, headerTitle } = useCalendarMaintenance();

  if (isLoading) {
    return (
      <Card>
        <CardHeader title={t('calendar.maintenance')} />
        <CardContent className="p-12">
          <DefaultLoading />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader title={t('calendar.maintenance')} />
      <CardContent>
        <Item>
          <ItemHeader className="fixed right-1 bottom-16 left-1 z-40 flex flex-row items-center justify-between py-4 md:static md:right-auto md:left-auto md:z-auto">
            <ItemContent className="flex-row items-baseline gap-2">
              <ItemTitle className="text-xl font-semibold">{String(currentDate.getDate()).padStart(2, '0')}</ItemTitle>
              <ItemTitle className="text-xl font-semibold">{['dom.', 'seg.', 'ter.', 'qua.', 'qui.', 'sex.', 'sáb.'][currentDate.getDay()]}</ItemTitle>
              <ItemDescription className="text-lg">{headerTitle}</ItemDescription>
            </ItemContent>
            <ItemContent className="flex-row items-center gap-2">
              <div className="relative flex items-center md:items-stretch">
                <Button variant="outline" onClick={handlePrevious} aria-label="previous" className="rounded-none rounded-l-md border-r-0 px-2">
                  <ChevronLeft className="size-5 stroke-[1.8]" aria-hidden="true" />
                </Button>
                <Button variant="outline" onClick={() => setCurrentDate(new Date())} className="hidden rounded-none border-x-0 md:block">
                  {t('today')}
                </Button>
                <Button variant="outline" onClick={handleNext} aria-label="next" className="rounded-none rounded-r-md border-l-0 px-2">
                  <ChevronRight className="size-5 stroke-[1.8]" aria-hidden="true" />
                </Button>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <span>
                      <span className="min-[480px]:hidden" aria-hidden="true">
                        {t(view).charAt(0).toUpperCase()}
                      </span>
                      <span className="max-[479px]:sr-only">{capitalizeString(t(view))}</span>
                    </span>
                    <ChevronDown className="-me-1 size-4" aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setView('month')}>
                    {t('month')} <DropdownMenuShortcut>M</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setView('week')}>
                    {t('week')} <DropdownMenuShortcut>S</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </ItemContent>
          </ItemHeader>
          <ItemContent className="h-full flex-1 p-0 md:p-0">
            {view === 'month' ? (
              <MonthView currentDate={currentDate} events={events} onEventSelect={handleEventSelect} onEventCreate={handleEventCreate} />
            ) : (
              <WeekView currentDate={currentDate} events={events} onEventSelect={handleEventSelect} onEventCreate={handleEventCreate} />
            )}
          </ItemContent>
        </Item>
      </CardContent>
    </Card>
  );
}
