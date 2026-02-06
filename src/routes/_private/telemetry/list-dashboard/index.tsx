import { createFileRoute } from '@tanstack/react-router';
import { Plus, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ItemGroup } from '@/components/ui/item';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDashboards } from '@/hooks/use-dashboards-api';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { DashboardItem } from './@components/dashboard-item';
import { type DashboardListSearch, dashboardListSearchSchema } from './@interface/list-dashboard.schema';

export const Route = createFileRoute('/_private/telemetry/list-dashboard/')({
  component: ListDashboardPage,
  validateSearch: (search: Record<string, unknown>): DashboardListSearch => dashboardListSearchSchema.parse(search),
  staticData: {
    title: 'telemetry.list-dashboard',
    description:
      'Lista de dashboards customizáveis de telemetria. Permite criar, visualizar e gerenciar dashboards personalizados com widgets de sensores e métricas. Suporta busca e paginação.',
    tags: ['dashboards', 'custom-dashboards', 'widgets', 'telemetry-views', 'personalization', 'iot-dashboard'],
    examplePrompts: ['Ver lista de dashboards personalizados', 'Criar novo dashboard de telemetria', 'Buscar dashboard por nome'],
    searchParams: [
      { name: 'page', type: 'number', description: 'Número da página (padrão: 1)' },
      { name: 'size', type: 'number', description: 'Tamanho da página (padrão: 10)' },
      { name: 'search', type: 'string', description: 'Termo de busca' },
      { name: 'idEnterprise', type: 'string', description: 'ID da empresa' },
    ],
    relatedRoutes: [
      { path: '/_private/telemetry', relation: 'parent', description: 'Hub de telemetria' },
      { path: '/_private/telemetry/list-dashboard/add', relation: 'child', description: 'Criação de dashboard' },
    ],
    entities: ['Dashboard', 'Widget'],
    capabilities: [
      'Listagem paginada de dashboards',
      'Busca por nome/descrição',
      'Criação de novos dashboards',
      'Acesso a dashboards existentes',
      'Paginação com tamanhos variáveis (5/10/20/50)',
      'Total de dashboards',
    ],
  },
});

function ListDashboardPage() {
  const { t } = useTranslation();
  const navigate = Route.useNavigate();
  const searchParams = Route.useSearch();
  const { page, size, search } = searchParams;
  const { idEnterprise } = useEnterpriseFilter();

  const { data, isLoading } = useDashboards({
    ...searchParams,
    idEnterprise: searchParams.idEnterprise || idEnterprise,
    page: searchParams.page - 1,
  });

  const dashboards = data?.data || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / size);

  return (
    <Card>
      <CardHeader title={t('telemetry.list.dashboard')}>
        <div className="flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row">
          <div className="relative w-full sm:max-w-64">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t('search')}
              className="pl-9"
              defaultValue={search || ''}
              onBlur={(e) => {
                if (e.target.value !== search) {
                  navigate({
                    search: (prev: DashboardListSearch) => ({ ...prev, search: e.target.value || undefined, page: 1 }),
                  });
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate({
                    search: (prev: DashboardListSearch) => ({ ...prev, search: e.currentTarget.value || undefined, page: 1 }),
                  });
                }
              }}
            />
          </div>
          {/* {hasPermissionEditor && ( */}
          <Button onClick={() => navigate({ to: './add' } as any)}>
            <Plus className="mr-2 size-4" />
            {t('new')}
          </Button>
          {/* )} */}
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <DefaultLoading />
        ) : !dashboards.length ? (
          <DefaultEmptyData />
        ) : (
          <ItemGroup>
            {dashboards.map((dashboard) => (
              <DashboardItem key={dashboard.id} item={dashboard} />
            ))}
          </ItemGroup>
        )}
      </CardContent>

      {totalCount > 0 && (
        <CardFooter layout="multi">
          <div className="order-2 flex items-center gap-2 text-muted-foreground text-sm sm:order-1">
            <span>{t('show')}</span>
            <Select value={String(size)} onValueChange={(val) => navigate({ search: (prev) => ({ ...prev, size: Number(val), page: 1 }) })}>
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span>{t('per.page')}</span>
            <span className="ml-4 tabular-nums">
              {t('total')}: {totalCount}
            </span>
          </div>

          <div className="order-1 sm:order-2">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page > 1) navigate({ search: (prev: DashboardListSearch) => ({ ...prev, page: page - 1 }) });
                    }}
                    aria-disabled={page <= 1}
                    className={page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate({ search: (prev: DashboardListSearch) => ({ ...prev, page: pageNum }) });
                        }}
                        isActive={page === pageNum}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                {totalPages > 5 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page < totalPages) navigate({ search: (prev: DashboardListSearch) => ({ ...prev, page: page + 1 }) });
                    }}
                    aria-disabled={page >= totalPages}
                    className={page >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
