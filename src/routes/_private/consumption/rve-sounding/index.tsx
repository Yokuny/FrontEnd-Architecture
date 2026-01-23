import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { RVESoundingFilter } from './@components/rve-sounding-filter';
import { RVESoundingList } from './@components/rve-sounding-list';
import { useRVESoundingDashboard } from './@hooks/use-rve-sounding-api';
import { rveSoundingSearchParamsSchema } from './@interface/rve-sounding.types';

export const Route = createFileRoute('/_private/consumption/rve-sounding/')({
  component: RVESoundingDashboardPage,
  validateSearch: rveSoundingSearchParamsSchema,
});

function RVESoundingDashboardPage() {
  const { t } = useTranslation();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const { idEnterprise } = useEnterpriseFilter();

  const { data, isLoading } = useRVESoundingDashboard(idEnterprise, search.machines, search.dateStart, search.dateEnd);

  const handleFilterChange = (newFilters: any) => {
    navigate({
      search: (prev) => ({
        ...prev,
        ...newFilters,
      }),
    });
  };

  return (
    <Card>
      <CardHeader title={t('polling')} />

      <CardContent>
        <RVESoundingFilter idEnterprise={idEnterprise} filters={search} onFilterChange={handleFilterChange} isLoading={isLoading} />
        <RVESoundingList data={data} isLoading={isLoading} />
      </CardContent>
    </Card>
  );
}
