import { createFileRoute } from '@tanstack/react-router';
import { parseISO } from 'date-fns';
import { AlertCircle, BrushCleaning, CalendarIcon, CheckCircle, Hash, Plus, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { MachineByEnterpriseSelect } from '@/components/selects/machine-by-enterprise-select';
import { MaintenanceTypeSelect } from '@/components/selects/maintenance-type-select';
import { StatusSelect } from '@/components/selects/status-select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Item } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { formatDate } from '@/lib/formatDate';
import { cn } from '@/lib/utils';
import { FilledFormTable } from './@components/filled-form-table';
import { KPI } from './@components/KPI';
import { useCmmsActivities, useFilledForms } from './@hooks/use-filled-form-api';
import { filledFormSearchSchema } from './@interface/filled-form.schema';

export const Route = createFileRoute('/_private/cmms/filled-form-cmms/')({
  staticData: {
    title: 'filled.forms',
    description:
      'Página de gerenciamento de formulários CMMS preenchidos. Permite visualizar, filtrar e analisar histórico de inspeções, checklists e formulários digitais de manutenção com KPIs de performance.',
    tags: ['cmms', 'form', 'formulário', 'filled', 'preenchido', 'checklist', 'inspection', 'inspeção', 'maintenance', 'manutenção', 'kpi'],
    examplePrompts: ['Ver formulários CMMS preenchidos', 'Listar inspeções realizadas', 'Filtrar checklists por máquina e período', 'Analisar KPIs de manutenção'],
    searchParams: [
      { name: 'page', type: 'number', description: 'Número da página', example: '1' },
      { name: 'size', type: 'number', description: 'Itens por página', example: '10' },
      { name: 'search', type: 'string', description: 'Termo de busca' },
      { name: 'machines', type: 'array', description: 'IDs das máquinas' },
      { name: 'initialDate', type: 'string', description: 'Data inicial YYYY-MM-DD' },
      { name: 'finalDate', type: 'string', description: 'Data final YYYY-MM-DD' },
      { name: 'status', type: 'string', description: 'Status do formulário' },
      { name: 'tipoManutencao', type: 'string', description: 'Tipo de manutenção' },
    ],
    relatedRoutes: [
      { path: '/_private/cmms', relation: 'parent', description: 'Hub CMMS' },
      { path: '/_private/maintenance', relation: 'sibling', description: 'Gestão de manutenção' },
    ],
    entities: ['Form', 'FormResponse', 'Machine', 'KPI'],
    capabilities: ['Listar formulários preenchidos', 'Filtrar por máquinas e período', 'Visualizar KPIs consolidados', 'Filtrar por status e tipo de manutenção'],
  },
  component: CMMSFilledFormsPage,
  validateSearch: filledFormSearchSchema,
});

function CMMSFilledFormsPage() {
  const { t } = useTranslation();
  const navigate = Route.useNavigate();
  const searchParams = Route.useSearch();
  const { idEnterprise } = useEnterpriseFilter();

  const [search, setSearch] = useState(searchParams.search || '');
  const [machines, setMachines] = useState<string[]>(Array.isArray(searchParams.machines) ? searchParams.machines : searchParams.machines ? [searchParams.machines] : []);
  const [initialDate, setInitialDate] = useState<Date | undefined>(searchParams.initialDate ? parseISO(searchParams.initialDate) : undefined);
  const [finalDate, setFinalDate] = useState<Date | undefined>(searchParams.finalDate ? parseISO(searchParams.finalDate) : undefined);
  const [status, setStatus] = useState<string | undefined>(Array.isArray(searchParams.status) ? searchParams.status[0] : searchParams.status);
  const [tipoManutencao, setTipoManutencao] = useState<string | undefined>(
    Array.isArray(searchParams.tipoManutencao) ? searchParams.tipoManutencao[0] : searchParams.tipoManutencao,
  );
  const [osCodeJobId, setOsCodeJobId] = useState(searchParams.osCodeJobId || '');
  const [finishedAt, setFinishedAt] = useState<string | undefined>(searchParams.finishedAt ? String(searchParams.finishedAt) : undefined);
  const [equipmentCritical, setEquipmentCritical] = useState<string | undefined>(searchParams.equipmentCritical);

  // Data Fetching
  const { data, isLoading } = useFilledForms({
    ...searchParams,
    machines: machines.length > 0 ? machines : undefined, // Override local state if needed or rely on searchParams
    // Using searchParams ensures we are always fetching based on URL (single source of truth)
  });

  const { data: kpiData } = useCmmsActivities(data?.idForm, searchParams);

  // Sync idForm from response to URL if missing (Legacy behavior)
  useEffect(() => {
    if (data?.idForm && data.idForm !== searchParams.idForm) {
      navigate({
        search: (prev) => ({ ...prev, idForm: data.idForm }),
        replace: true,
      });
    }
  }, [data?.idForm, navigate, searchParams.idForm]);

  const handleSearch = () => {
    navigate({
      search: (prev) => ({
        ...prev,
        page: 1,
        search: search || undefined,
        machines: machines.length > 0 ? machines : undefined,
        initialDate: initialDate ? formatDate(initialDate, 'yyyy-MM-dd') : undefined,
        finalDate: finalDate ? formatDate(finalDate, 'yyyy-MM-dd') : undefined,
        status: status === 'all' ? undefined : status,
        tipoManutencao: tipoManutencao === 'all' ? undefined : tipoManutencao,
        osCodeJobId: osCodeJobId || undefined,
        finishedAt: finishedAt || undefined,
        equipmentCritical: equipmentCritical || undefined,
      }),
    });
  };

  const handleClear = () => {
    setSearch('');
    setMachines([]);
    setInitialDate(undefined);
    setFinalDate(undefined);
    setStatus(undefined);
    setTipoManutencao(undefined);
    setOsCodeJobId('');
    setFinishedAt(undefined);
    setEquipmentCritical(undefined);

    navigate({
      search: (prev) => ({
        ...prev,
        page: 1,
        search: undefined,
        machines: undefined,
        initialDate: undefined,
        finalDate: undefined,
        status: undefined,
        tipoManutencao: undefined,
        osCodeJobId: undefined,
        finishedAt: undefined,
        equipmentCritical: undefined,
      }),
    });
  };

  const handlePageChange = (page: number) => {
    navigate({ search: (prev) => ({ ...prev, page }) });
  };

  const handleSizeChange = (size: number) => {
    navigate({ search: (prev) => ({ ...prev, size, page: 1 }) });
  };

  const handleKpiFilter = (value: string, type: 'status' | 'tipoManutencao') => {
    // Toggle logic
    const currentVal = type === 'status' ? searchParams.status : searchParams.tipoManutencao;
    let newVal: string | undefined = value;

    // If current value is array, handle array logic? schema says union string | array
    // Simplified: if already selected, deselect. Else select.
    const currentStr = Array.isArray(currentVal) ? currentVal[0] : currentVal;

    if (currentStr === value) {
      newVal = undefined;
    }

    navigate({
      search: (prev) => ({
        ...prev,
        page: 1,
        [type]: newVal,
      }),
    });

    // Update local state to reflect change immediately in UI if needed,
    // but useEffect sync with URL is better practice or just relying on searchParams for active state
    if (type === 'status') setStatus(newVal);
    if (type === 'tipoManutencao') setTipoManutencao(newVal);
  };

  // derived active filters for KPI
  const activeKpiFilters = {
    status: Array.isArray(searchParams.status) ? searchParams.status[0] : searchParams.status,
    tipoManutencao: Array.isArray(searchParams.tipoManutencao) ? searchParams.tipoManutencao[0] : searchParams.tipoManutencao,
  };

  return (
    <Card>
      <CardHeader title={data?.title || t('filled.forms')}>
        <div className="flex items-center gap-2">
          {/* Add button logic if needed, legacy had specific permissions check */}
          <Button variant="outline" onClick={() => toast.info(t('functionality.not.implemented'))}>
            <Plus className="mr-2 size-4" />
            {t('add.form')}
          </Button>
        </div>
      </CardHeader>

      {/* KPI Section */}
      {kpiData && (
        <div className="mb-6 px-6">
          <KPI data={kpiData} onFilter={handleKpiFilter} activeFilters={activeKpiFilters} />
        </div>
      )}

      <CardContent className="space-y-6">
        <Item variant="outline" className="bg-secondary">
          {/* Search */}
          <div className="flex flex-col gap-1.5">
            <Label>{t('search')}</Label>
            <div className="relative">
              <Search className="absolute top-3 left-2 size-4 text-muted-foreground" />
              <Input placeholder={t('search')} value={search} onChange={(e) => setSearch(e.target.value)} className="h-10 w-48 bg-background pl-8" />
            </div>
          </div>

          <MachineByEnterpriseSelect
            mode="multi"
            idEnterprise={idEnterprise}
            value={machines}
            onChange={setMachines}
            label={t('machines')}
            placeholder={t('select.machine')}
            className="w-48 bg-background"
          />

          <div className="flex flex-col gap-1.5">
            <Label>{t('date.start')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn('w-40 justify-start bg-background text-left font-normal', !initialDate && 'text-muted-foreground')}>
                  <CalendarIcon className="mr-1 size-4" />
                  {initialDate ? formatDate(initialDate, 'dd MM yyyy') : <span>{t('date.start')}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={initialDate} onSelect={setInitialDate} captionLayout="dropdown-years" startMonth={new Date(2010, 0)} endMonth={new Date()} />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>{t('date.end')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn('w-40 justify-start bg-background text-left font-normal', !finalDate && 'text-muted-foreground')}>
                  <CalendarIcon className="mr-1 size-4" />
                  {finalDate ? formatDate(finalDate, 'dd MM yyyy') : <span>{t('date.end')}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={finalDate} onSelect={setFinalDate} captionLayout="dropdown-years" startMonth={new Date(2010, 0)} endMonth={new Date()} />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>{t('os.code.job.id.label')}</Label>
            <div className="relative">
              <Hash className="absolute top-3 left-2 size-4 text-muted-foreground" />
              <Input placeholder={t('os.code.job.id.placeholder')} value={osCodeJobId} onChange={(e) => setOsCodeJobId(e.target.value)} className="h-10 w-48 bg-background pl-8" />
            </div>
          </div>

          <MaintenanceTypeSelect
            mode="single"
            idEnterprise={idEnterprise}
            value={tipoManutencao}
            onChange={setTipoManutencao}
            label={t('maintenance.type')}
            className="w-48 bg-background"
          />

          <StatusSelect mode="single" idEnterprise={idEnterprise} value={status} onChange={setStatus} label={t('status')} className="min-w-36 bg-background" />

          <div className="flex flex-col gap-1.5">
            <Label className="flex items-center gap-2">
              <AlertCircle className="size-4" />
              {t('critical.equipment.label')}
            </Label>
            <Select value={equipmentCritical || ''} onValueChange={(val) => setEquipmentCritical(val === 'all' ? undefined : val)}>
              <SelectTrigger className="min-w-40 bg-background">
                <SelectValue placeholder={t('critical')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('all')}</SelectItem>
                <SelectItem value="true">{t('yes')}</SelectItem>
                <SelectItem value="false">{t('not')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="flex items-center gap-2">
              <CheckCircle className="size-4" />
              {t('finished.at.label')}
            </Label>
            <Select value={finishedAt || ''} onValueChange={(val) => setFinishedAt(val === 'all' ? undefined : val)}>
              <SelectTrigger className="min-w-40 bg-background">
                <SelectValue placeholder={t('finished.at.placeholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('all')}</SelectItem>
                <SelectItem value="true">{t('finished.at.true')}</SelectItem>
                <SelectItem value="false">{t('finished.at.false')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="ml-auto flex gap-2">
            <Button onClick={handleClear} className="text-amber-700 hover:bg-amber-100 hover:text-amber-800">
              <BrushCleaning className="size-4" />
            </Button>
            <Button onClick={handleSearch} className="gap-2">
              <Search className="size-4" />
              {t('filter')}
            </Button>
          </div>
        </Item>

        <FilledFormTable
          data={data}
          isLoading={isLoading}
          page={searchParams.page || 1}
          pageSize={searchParams.size || 10}
          totalItems={data?.pageInfo?.count || 0}
          onPageChange={handlePageChange}
          onSizeChange={handleSizeChange}
        />
      </CardContent>
    </Card>
  );
}
