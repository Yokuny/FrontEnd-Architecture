import { createFileRoute } from '@tanstack/react-router';
import { isValid, subMonths } from 'date-fns';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useRVEDashboard } from '@/hooks/use-cmms-rve-api';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { formatDate } from '@/lib/formatDate';
import { KPI } from './@components/KPI';
import { RVEFilter } from './@components/RVEFilter';
import { RVEOperationalChart } from './@components/RVEOperationalChart';
import { RVEScaleChart } from './@components/RVEScaleChart';

const searchSchema = z.object({
  initialDate: z.string().optional(),
  finalDate: z.string().optional(),
  machines: z.string().optional(),
});

export const Route = createFileRoute('/_private/statistics/rve-dashboard/')({
  component: RVEDashboardPage,
  validateSearch: (search) => searchSchema.parse(search),
});

function RVEDashboardPage() {
  useTranslation();
  const { idEnterprise } = useEnterpriseFilter();
  const navigate = Route.useNavigate();
  const { initialDate, finalDate, machines } = Route.useSearch();

  // Default dates: last 30 days
  const defaultInitial = useMemo(() => subMonths(new Date(), 1), []);
  const defaultFinal = useMemo(() => new Date(), []);

  const parsedInitialDate = useMemo(() => {
    if (!initialDate) return defaultInitial;
    const d = new Date(initialDate);
    return isValid(d) ? d : defaultInitial;
  }, [initialDate, defaultInitial]);

  const parsedFinalDate = useMemo(() => {
    if (!finalDate) return defaultFinal;
    const d = new Date(finalDate);
    return isValid(d) ? d : defaultFinal;
  }, [finalDate, defaultFinal]);

  const parsedMachines = useMemo(() => machines?.split(',').filter(Boolean) || [], [machines]);

  const apiFilters = useMemo(() => {
    const filters: any = {};
    if (parsedMachines.length > 0) {
      filters.machines = parsedMachines.join(',');
    }
    filters.dateStart = parsedInitialDate.toISOString();
    filters.dateEnd = parsedFinalDate.toISOString();
    return filters;
  }, [parsedMachines, parsedInitialDate, parsedFinalDate]);

  const { data, isLoading } = useRVEDashboard(idEnterprise, apiFilters);

  const handleSearch = (values: { machines?: string[]; initialDate?: Date; finalDate?: Date }) => {
    navigate({
      search: (prev: any) => ({
        ...prev,
        machines: values.machines?.length ? values.machines.join(',') : undefined,
        initialDate: values.initialDate ? formatDate(values.initialDate, 'yyyy-MM-dd') : undefined,
        finalDate: values.finalDate ? formatDate(values.finalDate, 'yyyy-MM-dd') : undefined,
      }),
    });
  };

  const hasData = useMemo(() => {
    return (data?.codigosOperacionais?.length || 0) > 0 || (data?.escalas?.length || 0) > 0;
  }, [data]);

  return (
    <Card>
      <CardHeader title="RVE Dashboard" />
      <CardContent className="flex flex-col gap-6">
        <RVEFilter
          idEnterprise={idEnterprise}
          initialValues={{
            machines: parsedMachines,
            initialDate: parsedInitialDate,
            finalDate: parsedFinalDate,
          }}
          onSearch={handleSearch}
          isLoading={isLoading}
        />
        {isLoading && <DefaultLoading />}
        {!hasData && !isLoading && <DefaultEmptyData />}
        {!isLoading && hasData && (
          <>
            <KPI data={data?.codigosOperacionais || []} />
            <RVEOperationalChart data={data?.codigosOperacionais || []} />
            <RVEScaleChart data={data?.escalas || []} />
          </>
        )}
      </CardContent>
    </Card>
  );
}
