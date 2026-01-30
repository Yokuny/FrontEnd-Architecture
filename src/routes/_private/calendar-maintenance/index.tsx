import { createFileRoute } from '@tanstack/react-router';
import { BrushCleaning, ChevronDown, ChevronLeft, ChevronRight, Filter, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import EmptyData from '@/components/default-empty-data';
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
import { formatDate } from '@/lib/formatDate';

import { EditEventDialog } from './@components/EditEventDialog';
import { MonthView } from './@components/Month';
import { WeekView } from './@components/Week';
import { useCalendarMaintenance } from './@hooks/use-calendar-maintenance';
import { capitalizeString } from './@utils/calendar.utils';

const searchSchema = z.object({
  id: z.string().optional(),
});

export const Route = createFileRoute('/_private/calendar-maintenance/')({
  component: CalendarMaintenancePage,
  validateSearch: searchSchema,
  beforeLoad: () => ({
    title: 'calendar.maintenance',
  }),
});

function CalendarMaintenancePage() {
  const { t } = useTranslation();
  const { id: idEnterpriseQuery } = Route.useSearch();
  const { idEnterprise: idEnterpriseFilter } = useEnterpriseFilter();
  const idEnterprise = idEnterpriseQuery || idEnterpriseFilter;
  if (!idEnterprise) {
    return (
      <Card>
        <CardHeader title={t('calendar.maintenance')} />
        <CardContent>
          <EmptyData />
        </CardContent>
      </Card>
    );
  }
  return <CalendarMaintenanceContent idEnterprise={idEnterprise} />;
}

function CalendarMaintenanceContent({ idEnterprise }: { idEnterprise: string }) {
  const { t } = useTranslation();
  const {
    currentDate,
    setCurrentDate,
    events,
    view,
    setView,
    isLoading,
    handlePrevious,
    handleNext,
    handleEventCreate,
    handleAddEvent,
    handleEventSelect,
    headerTitle,
    filters,
    setFilters,
    isDialogOpen,
    setIsDialogOpen,
    selectedEvent,
  } = useCalendarMaintenance(idEnterprise);

  const [showFilters, setShowFilters] = useState(false);

  return (
    <Card className="gap-1">
      <CardHeader title={t('calendar.maintenance')}>
        <Item className="items-center p-0">
          <ItemContent className="flex-row items-baseline gap-2">
            <ItemTitle className="font-semibold text-xl">{String(currentDate.getDate()).padStart(2, '0')}</ItemTitle>
            <ItemTitle className="font-semibold text-xl">{formatDate(currentDate, 'EEE.')}</ItemTitle>
            <ItemDescription className="text-lg">{headerTitle}</ItemDescription>
          </ItemContent>
          <ItemContent className="flex-row items-center gap-2">
            <div className="relative flex items-center md:items-stretch">
              <Button variant="outline" onClick={handlePrevious} aria-label="previous" className="w-6 justify-start rounded-none rounded-l-md border-r-0">
                <ChevronLeft className="size-5 stroke-[1.8]" aria-hidden="true" />
              </Button>
              <Button variant="outline" onClick={() => setCurrentDate(new Date())} className="hidden rounded-none border-x-0 md:block">
                {t('today')}
              </Button>
              <Button variant="outline" onClick={handleNext} aria-label="next" className="w-6 justify-end rounded-none rounded-r-md border-l-0 p-0">
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
            <Button variant={showFilters ? 'secondary' : 'outline'} onClick={() => setShowFilters(!showFilters)}>
              <Filter className="size-4" />
            </Button>
            <Button onClick={handleAddEvent}>
              <Plus className="size-4" />
              <ItemContent className="max-sm:hidden">{t('add')}</ItemContent>
            </Button>
          </ItemContent>
        </Item>
      </CardHeader>
      <CardContent className="flex flex-col">
        {showFilters && (
          <Item variant="outline" className="gap-4 bg-secondary">
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
              <span className="font-medium text-muted-foreground text-xs">{t('status')}</span>
              <Select value={filters.status || 'all'} onValueChange={(val) => setFilters((prev) => ({ ...prev, status: val === 'all' ? undefined : (val as any) }))}>
                <SelectTrigger className="h-10 bg-background">
                  <SelectValue placeholder={t('all')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('all')}</SelectItem>
                  <SelectItem value="next">{t('status.next')}</SelectItem>
                  <SelectItem value="late">{t('status.late')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="ml-auto flex gap-2">
              <Button className="text-amber-700 hover:text-amber-800" variant="outline" onClick={() => setFilters({})}>
                <BrushCleaning className="size-4" />
              </Button>
              <Button variant="outline" className="flex-1 gap-2 bg-background">
                <Search className="size-4" />
                {t('search')}
              </Button>
            </div>
          </Item>
        )}

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

        <EditEventDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} event={selectedEvent} idEnterprise={idEnterprise} />
      </CardContent>
    </Card>
  );
}
