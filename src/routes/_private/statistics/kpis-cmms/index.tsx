import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { format } from 'date-fns';
import { CalendarIcon, Search } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MachineByEnterpriseSelect } from '@/components/selects/machine-by-enterprise-select';
import { MaintenanceTypeSelect } from '@/components/selects/maintenance-type-select';
import { StatusSelect } from '@/components/selects/status-select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ItemGroup } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { cn } from '@/lib/utils';
import { DeviationsChart } from './@components/DeviationsChart';
import { KPI } from './@components/KPI';
import { ReliabilityGroupChart } from './@components/ReliabilityGroupChart';
import { ReliabilityVesselChart } from './@components/ReliabilityVesselChart';
import { StatusChart } from './@components/StatusChart';
import { TasksVesselChart } from './@components/TasksVesselChart';
import { searchSchema } from './@interface/kpis-cmms.schema';

export const Route = createFileRoute('/_private/statistics/kpis-cmms/')({
  component: KPISCMMSPage,
  validateSearch: (search) => searchSchema.parse(search),
});

function KPISCMMSPage() {
  const { t } = useTranslation();
  const { idEnterprise } = useEnterpriseFilter();
  const navigate = useNavigate();
  const search = Route.useSearch();

  const [dateMin, setDateMin] = useState<Date>(search.initialDate ? new Date(search.initialDate) : new Date(new Date().setMonth(new Date().getMonth() - 1)));
  const [dateMax, setDateMax] = useState<Date>(search.finalDate ? new Date(search.finalDate) : new Date());
  const [selectedMachines, setSelectedMachines] = useState<string[]>(search.machines?.split(',') || []);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(search.status);
  const [selectedMaintenanceTypes, setSelectedMaintenanceTypes] = useState<string[]>(search.tipoManutencao?.split(',') || []);
  const [selectedEquipment, setSelectedEquipment] = useState<string | undefined>(search.equipmentCritical);

  const [appliedFilters, setAppliedFilters] = useState<any>({
    idEnterprise,
    min: format(dateMin, 'yyyy-MM-dd'),
    max: format(dateMax, 'yyyy-MM-dd'),
    idMachines: search.machines,
    status: search.status,
    tipoManutencao: search.tipoManutencao,
    equipmentCritical: search.equipmentCritical,
  });

  const handleSearch = useCallback(() => {
    const filters = {
      initialDate: format(dateMin, 'yyyy-MM-dd'),
      finalDate: format(dateMax, 'yyyy-MM-dd'),
      machines: selectedMachines.length > 0 ? selectedMachines.join(',') : undefined,
      status: selectedStatus || undefined,
      tipoManutencao: selectedMaintenanceTypes.length > 0 ? selectedMaintenanceTypes.join(',') : undefined,
      equipmentCritical: selectedEquipment === 'All' ? undefined : selectedEquipment || undefined,
    };

    navigate({
      to: '.',
      search: (prev: any) => ({ ...prev, ...filters }),
    });

    setAppliedFilters({
      idEnterprise,
      min: filters.initialDate,
      max: filters.finalDate,
      idMachines: filters.machines,
      status: filters.status,
      tipoManutencao: filters.tipoManutencao,
      equipmentCritical: filters.equipmentCritical,
    });
  }, [idEnterprise, dateMin, dateMax, selectedMachines, selectedStatus, selectedMaintenanceTypes, selectedEquipment, navigate]);

  useEffect(() => {
    if (idEnterprise) {
      handleSearch();
    }
  }, [idEnterprise, handleSearch]);

  return (
    <Card>
      <CardHeader title="KPI's CMMS" />
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-wrap items-end gap-4 rounded-lg border bg-secondary/50 p-4">
          <MachineByEnterpriseSelect mode="multi" idEnterprise={idEnterprise} value={selectedMachines} onChange={setSelectedMachines} label={t('vessels')} className="w-64" />

          <div className="flex flex-col gap-1.5">
            <Label>{t('date.start')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn('w-40 justify-start bg-background text-left font-normal', !dateMin && 'text-muted-foreground')}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateMin ? format(dateMin, 'dd MM yyyy') : <span>{t('date.start')}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateMin}
                  onSelect={(date) => date && setDateMin(date)}
                  initialFocus
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
                <Button variant="outline" className={cn('w-40 justify-start bg-background text-left font-normal', !dateMax && 'text-muted-foreground')}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateMax ? format(dateMax, 'dd MM yyyy') : <span>{t('date.end')}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateMax}
                  onSelect={(date) => date && setDateMax(date)}
                  initialFocus
                  captionLayout="dropdown-years"
                  startMonth={new Date(2010, 0)}
                  endMonth={new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          <MaintenanceTypeSelect
            mode="multi"
            idEnterprise={idEnterprise}
            value={selectedMaintenanceTypes}
            onChange={(vals) => setSelectedMaintenanceTypes(vals)}
            className="w-64"
          />

          <div className="flex flex-col gap-1.5">
            <Label>{t('critical.equipment.label')}</Label>
            <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
              <SelectTrigger className="w-48 bg-background">
                <SelectValue placeholder={t('critical.equipment.placeholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">{t('all')}</SelectItem>
                <SelectItem value="true">{t('critical')}</SelectItem>
                <SelectItem value="false">{t('critical.equipment.false')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <StatusSelect mode="single" value={selectedStatus} onChange={setSelectedStatus} className="w-48" />

          <Button onClick={handleSearch} className="ml-auto">
            <Search className="mr-2 size-4" />
            {t('search')}
          </Button>
        </div>

        <KPI filters={appliedFilters} />

        {/* Charts Grid */}
        <ItemGroup className="gap-6">
          <div className="flex w-full flex-wrap gap-6 lg:flex-nowrap">
            <ReliabilityVesselChart filters={appliedFilters} />
            <ReliabilityGroupChart filters={appliedFilters} />
          </div>

          <TasksVesselChart filters={appliedFilters} />

          <div className="flex w-full gap-4">
            <div className="flex-1">
              <StatusChart filters={appliedFilters} />
            </div>
            <div className="flex-1">
              <DeviationsChart filters={appliedFilters} />
            </div>
          </div>
        </ItemGroup>
      </CardContent>
    </Card>
  );
}
