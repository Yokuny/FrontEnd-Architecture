import { createFileRoute } from '@tanstack/react-router';
import { ChevronDown, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import DefaultLoading from '@/components/default-loading';
import { MachineByEnterpriseSelect } from '@/components/selects/machine-by-enterprise-select';
import { MachineManagerSelect } from '@/components/selects/machine-manager-select';
import { MaintenancePlanSelect } from '@/components/selects/maintenance-plan-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuShortcut, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
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
  const { idEnterprise } = useEnterpriseFilter();
  const { currentDate, setCurrentDate, events, view, setView, isLoading, handlePrevious, handleNext, handleEventCreate, handleEventSelect, headerTitle, filters, setFilters } =
    useCalendarMaintenance();

  return (
    <Card className="gap-1">
      <CardHeader title={t('calendar.maintenance')}>
        <Item className="items-center p-0">
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
        </Item>
      </CardHeader>
      <CardContent className="flex flex-col">
        <Item variant="outline" className="bg-secondary gap-4">
          <MachineByEnterpriseSelect
            mode="multi"
            label={t('machines')}
            idEnterprise={idEnterprise}
            value={filters.idMachine || []}
            onChange={(vals) => setFilters((prev) => ({ ...prev, idMachine: vals }))}
          />

          <MaintenancePlanSelect
            mode="multi"
            label={t('maintenance.plans')}
            idEnterprise={idEnterprise}
            value={filters.idMaintenancePlan || []}
            onChange={(vals) => setFilters((prev) => ({ ...prev, idMaintenancePlan: vals }))}
          />

          <MachineManagerSelect
            mode="multi"
            label={t('managers')}
            idEnterprise={idEnterprise}
            value={filters.managers || []}
            onChange={(vals) => setFilters((prev) => ({ ...prev, managers: vals }))}
          />

          <div className="flex flex-col gap-1.5">
            <span className="text-muted-foreground text-xs font-medium">{t('status')}</span>
            <Select value={filters.status || 'all'} onValueChange={(val) => setFilters((prev) => ({ ...prev, status: val === 'all' ? undefined : (val as any) }))}>
              <SelectTrigger className="bg-background h-10">
                <SelectValue placeholder={t('all')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('all')}</SelectItem>
                <SelectItem value="next">{t('status.next')}</SelectItem>
                <SelectItem value="late">{t('status.late')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex ml-auto gap-2">
            <Button variant="outline" className="flex-1 gap-2 bg-background" onClick={() => setFilters({})}>
              {t('clear.filters')}
            </Button>
            <Button variant="outline" className="flex-1 gap-2 bg-background">
              <Search className="size-4" />
              {t('search')}
            </Button>
          </div>
        </Item>

        <ItemContent className="h-full">
          {isLoading ? (
            <div className="p-12">
              <DefaultLoading />
            </div>
          ) : view === 'month' ? (
            <MonthView currentDate={currentDate} events={events} onEventSelect={handleEventSelect} onEventCreate={handleEventCreate} />
          ) : (
            <WeekView currentDate={currentDate} events={events} onEventSelect={handleEventSelect} onEventCreate={handleEventCreate} />
          )}
        </ItemContent>
      </CardContent>
    </Card>
  );
}
