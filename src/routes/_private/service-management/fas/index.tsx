import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { differenceInMonths, isAfter, isValid, parseISO } from 'date-fns';
import { BrushCleaning, CalendarIcon, Download, FilePlus, Search } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { FasPlannerSelect } from '@/components/selects/fas-planner-select';
import { FasTypeSelect } from '@/components/selects/fas-type-select';
import { MachineByEnterpriseSelect } from '@/components/selects/machine-by-enterprise-select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Item } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { useExportFas } from '@/hooks/use-fas-api';
import { formatDate } from '@/lib/formatDate';
import { cn } from '@/lib/utils';
import { FasStatusSelect } from './@components/fas-status-select';
import { FasTable } from './@components/fas-table';
import { FAS_EXPORT_MAX_MONTHS } from './@consts/fas.consts';
import { useFasTable } from './@hooks/use-fas-table';
import { fasSearchSchema } from './@interface/fas.schema';

export const Route = createFileRoute('/_private/service-management/fas/')({
  component: FASPage,
  validateSearch: fasSearchSchema,
});

function FASPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const search = Route.useSearch();
  const { idEnterprise } = useEnterpriseFilter();
  const { data, isLoading, totalItems, onPageChange, onClearFilters } = useFasTable();

  // Local state for filters to follow 'comparative' pattern
  const [localSearch, setLocalSearch] = useState(search.search || '');
  const [localVessels, setLocalVessels] = useState<string[]>(search.idVessel || []);
  const [localStatus, setLocalStatus] = useState<string[]>(search.status || []);
  const [localType, setLocalType] = useState<string[]>(search.type || []);
  const [localPlanner, setLocalPlanner] = useState<string[]>(search.planner || []);
  const [localDateStart, setLocalDateStart] = useState<string>(search.dateStart || '');
  const [localDateEnd, setLocalDateEnd] = useState<string>(search.dateEnd || '');

  const handleSearch = useCallback(() => {
    navigate({
      search: {
        ...search,
        search: localSearch || undefined,
        idVessel: localVessels.length > 0 ? localVessels : undefined,
        status: localStatus.length > 0 ? localStatus : undefined,
        type: localType.length > 0 ? localType : undefined,
        planner: localPlanner.length > 0 ? localPlanner : undefined,
        dateStart: localDateStart || undefined,
        dateEnd: localDateEnd || undefined,
        page: 1,
      } as any,
      replace: true,
    });
  }, [navigate, search, localSearch, localVessels, localStatus, localType, localPlanner, localDateStart, localDateEnd]);

  const clearFilters = () => {
    setLocalSearch('');
    setLocalVessels([]);
    setLocalStatus([]);
    setLocalType([]);
    setLocalPlanner([]);
    setLocalDateStart('');
    setLocalDateEnd('');
    onClearFilters();
  };

  // Export Dialog State
  const [openExport, setOpenExport] = useState(false);
  const [exportDateStart, setExportDateStart] = useState('');
  const [exportDateEnd, setExportDateEnd] = useState('');
  const exportMutation = useExportFas();

  const handleExport = async () => {
    if (!idEnterprise) {
      toast.error(t('select.enterprise.first'));
      return;
    }

    if (!exportDateStart || !exportDateEnd) {
      toast.error(t('select.date.range'));
      return;
    }

    const start = parseISO(exportDateStart);
    const end = parseISO(exportDateEnd);

    if (!isValid(start) || !isValid(end)) {
      toast.error(t('invalid.date'));
      return;
    }

    if (isAfter(start, end)) {
      toast.error(t('date.end.is.before.date.start'));
      return;
    }

    if (differenceInMonths(end, start) > FAS_EXPORT_MAX_MONTHS) {
      toast.error(t('date.range.must.be.less.than.6.months'));
      return;
    }

    const formattedStart = `${exportDateStart}T00:00:00.000Z`;
    const formattedEnd = `${exportDateEnd}T23:59:59.999Z`;

    await exportMutation.mutateAsync({
      idEnterprise,
      dateStart: formattedStart,
      dateEnd: formattedEnd,
    });
    setOpenExport(false);
  };

  const hasFilter = !!(search.search || search.idVessel?.length || search.status?.length || search.type?.length || search.dateStart || search.dateEnd || search.planner?.length);

  return (
    <Card>
      <CardHeader title={t('service.management')}>
        <div className="flex items-center gap-2">
          {/* Export Dialog */}
          <Dialog open={openExport} onOpenChange={setOpenExport}>
            <DialogTrigger asChild>
              <Button variant="outline" disabled={exportMutation.isPending}>
                <Download className="mr-2 size-4" />
                {t('export')}
              </Button>
            </DialogTrigger>
            <DialogContent className="w-fit">
              <DialogHeader>
                <DialogTitle>{t('export')}</DialogTitle>
              </DialogHeader>
              <div className="flex gap-2">
                <div className="gap-2">
                  <Label htmlFor="dateExportStart">{t('date.start')}</Label>
                  <Input id="dateExportStart" type="date" value={exportDateStart} onChange={(e) => setExportDateStart(e.target.value)} />
                </div>
                <div className="gap-2">
                  <Label htmlFor="dateExportEnd">{t('date.end')}</Label>
                  <Input id="dateExportEnd" type="date" value={exportDateEnd} onChange={(e) => setExportDateEnd(e.target.value)} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenExport(false)}>
                  {t('cancel')}
                </Button>
                <Button onClick={handleExport} disabled={exportMutation.isPending}>
                  {exportMutation.isPending ? t('exporting') : t('export')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button onClick={() => navigate({ to: './add' } as any)}>
            <FilePlus className="size-4" />
            {t('new.fas')}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Filters */}
        <Item variant="outline" className="mb-6 flex-row items-end gap-4 overflow-x-auto bg-secondary">
          <div className="max-w-52">
            <Label>{t('search')}</Label>
            <div className="relative">
              <Search className="absolute top-3 left-2 size-4 text-muted-foreground" />
              <Input placeholder={t('search')} value={localSearch} onChange={(e) => setLocalSearch(e.target.value)} className="h-10 bg-background pl-8" />
            </div>
          </div>

          <MachineByEnterpriseSelect mode="multi" idEnterprise={idEnterprise} value={localVessels} onChange={setLocalVessels} label={t('vessels')} placeholder={t('vessel')} />
          <FasStatusSelect value={localStatus} onChange={setLocalStatus} placeholder={t('status')} />
          <FasTypeSelect mode="multi" value={localType} onChange={setLocalType} label={t('type')} placeholder={t('type')} />

          <div className="flex flex-col gap-1.5">
            <Label>{t('date.start')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn('w-40 justify-start bg-background text-left font-normal', !localDateStart && 'text-muted-foreground')}>
                  <CalendarIcon className="mr-1 size-4" />
                  {localDateStart ? formatDate(parseISO(localDateStart), 'dd MM yyyy') : <span>{t('date.start')}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={localDateStart ? parseISO(localDateStart) : undefined}
                  onSelect={(date) => setLocalDateStart(date ? formatDate(date, 'yyyy-MM-dd') : '')}
                  captionLayout="dropdown-years"
                  startMonth={new Date(2010, 0)}
                  endMonth={new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>{t('date.end')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn('w-40 justify-start bg-background text-left font-normal', !localDateEnd && 'text-muted-foreground')}>
                  <CalendarIcon className="mr-1 size-4" />
                  {localDateEnd ? formatDate(parseISO(localDateEnd), 'dd MM yyyy') : <span>{t('date.end')}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={localDateEnd ? parseISO(localDateEnd) : undefined}
                  onSelect={(date) => setLocalDateEnd(date ? formatDate(date, 'yyyy-MM-dd') : '')}
                  captionLayout="dropdown-years"
                  startMonth={new Date(2010, 0)}
                  endMonth={new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          <FasPlannerSelect
            mode="multi"
            idEnterprise={idEnterprise}
            value={localPlanner}
            onChange={setLocalPlanner}
            label={t('planner')}
            placeholder={t('planner')}
            className="bg-background"
          />

          <div className="ml-auto flex gap-2">
            {hasFilter && (
              <Button onClick={clearFilters}>
                <BrushCleaning className="size-4" />
              </Button>
            )}
            <Button variant={hasFilter ? 'default' : 'outline'} onClick={handleSearch} className="gap-2">
              <Search className="size-4" />
              {t('filter')}
            </Button>
          </div>
        </Item>

        <FasTable data={data} isLoading={isLoading} page={search.page || 1} pageSize={search.size || 10} totalItems={totalItems} onPageChange={onPageChange} />
      </CardContent>
    </Card>
  );
}
