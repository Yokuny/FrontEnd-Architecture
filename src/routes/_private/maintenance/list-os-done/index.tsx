import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import EmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { OsDoneItem } from './@components/os-done-item';
import { useListOrderServiceDone } from './@hooks/use-list-os-done-api';

const listOsDoneSearchSchema = z.object({
  page: z.number().optional().default(1),
  size: z.number().optional().default(10),
  search: z.string().optional(),
});

type ListOsDoneSearch = z.infer<typeof listOsDoneSearchSchema>;

export const Route = createFileRoute('/_private/maintenance/list-os-done/')({
  component: ListOsDonePage,
  validateSearch: (search: Record<string, unknown>): ListOsDoneSearch => listOsDoneSearchSchema.parse(search),
});

function ListOsDonePage() {
  const { t } = useTranslation();
  const navigate = useNavigate({ from: Route.fullPath });
  const { page, size, search } = Route.useSearch();
  const { idEnterprise } = useEnterpriseFilter();

  const { data, isLoading } = useListOrderServiceDone({
    page: page - 1,
    size,
    search,
    idEnterprise,
  });

  const totalItems = data?.pageInfo?.[0]?.count ?? 0;

  // TODO: Buscar permissões reais do usuário
  const hasViewPermission = true;

  return (
    <Card>
      <CardHeader title={t('done.os')}>
        <div className="relative w-full sm:max-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder={t('search')}
            className="pl-9"
            defaultValue={search || ''}
            onBlur={(e) => {
              if (e.target.value !== search) {
                navigate({ search: (prev: ListOsDoneSearch) => ({ ...prev, search: e.target.value || undefined, page: 1 }) });
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                navigate({ search: (prev: ListOsDoneSearch) => ({ ...prev, search: e.currentTarget.value || undefined, page: 1 }) });
              }
            }}
          />
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <DefaultLoading />
        ) : data?.data && data.data.length > 0 ? (
          <div className="space-y-3">
            {data.data.map((item) => (
              <OsDoneItem key={item.id} item={item} hasViewPermission={hasViewPermission} />
            ))}
          </div>
        ) : (
          <EmptyData />
        )}
      </CardContent>

      {totalItems > 0 && (
        <CardFooter layout="multi">
          <div className="flex items-center gap-2 text-sm text-muted-foreground order-2 sm:order-1">
            <span>{t('show')}</span>
            <Select value={String(size)} onValueChange={(val) => navigate({ search: (prev: ListOsDoneSearch) => ({ ...prev, size: Number(val), page: 1 }) })}>
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
              {t('total')}: {totalItems}
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
                      if (page > 1) navigate({ search: (prev: ListOsDoneSearch) => ({ ...prev, page: page - 1 }) });
                    }}
                    aria-disabled={page <= 1}
                    className={page <= 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>

                {/* Lógica simplificada de paginação numérica */}
                {Array.from({ length: Math.min(5, Math.ceil(totalItems / size)) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate({ search: (prev: ListOsDoneSearch) => ({ ...prev, page: pageNum }) });
                        }}
                        isActive={page === pageNum}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                {Math.ceil(totalItems / size) > 5 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page < Math.ceil(totalItems / size)) navigate({ search: (prev: ListOsDoneSearch) => ({ ...prev, page: page + 1 }) });
                    }}
                    aria-disabled={page >= Math.ceil(totalItems / size)}
                    className={page >= Math.ceil(totalItems / size) ? 'pointer-events-none opacity-50' : ''}
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
