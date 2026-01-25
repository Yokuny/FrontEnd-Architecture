import { createFileRoute } from '@tanstack/react-router';
import { MoreVertical, Pencil, Plus, Search, Ship, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { useVoyageApi, useVoyages } from './@hooks/use-kpis-travel-api';

const voyageSearchSchema = z.object({
  page: z.number().optional().default(1),
  size: z.number().optional().default(10),
  search: z.string().optional(),
});

type VoyageSearch = z.infer<typeof voyageSearchSchema>;

export const Route = createFileRoute('/_private/voyage/kpis-travel/')({
  component: KpisTravelListPage,
  validateSearch: (search: Record<string, unknown>): VoyageSearch => voyageSearchSchema.parse(search),
});

function KpisTravelListPage() {
  const { t } = useTranslation();
  const navigate = Route.useNavigate();
  const { page, size, search } = Route.useSearch();
  const { idEnterprise } = useEnterpriseFilter();

  const { data, isLoading } = useVoyages({
    page: page - 1,
    size,
    search,
    idEnterprise,
  });

  const { deleteVoyage } = useVoyageApi();

  const voyages = Array.isArray(data) ? data : (data as any)?.data || [];
  const totalCount = (data as any)?.pageInfo?.[0]?.count || voyages.length;
  const totalPages = Math.ceil(totalCount / size) || 1;

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(t('delete.confirmation'))) {
      deleteVoyage.mutate(id);
    }
  };

  return (
    <Card>
      <CardHeader title={t('voyage.list')}>
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
                    search: (prev: VoyageSearch) => ({ ...prev, search: e.target.value || undefined, page: 1 }),
                  });
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate({
                    search: (prev: VoyageSearch) => ({ ...prev, search: e.currentTarget.value || undefined, page: 1 }),
                  });
                }
              }}
            />
          </div>
          <Button onClick={() => navigate({ to: '/voyage/kpis-travel/add' })}>
            <Plus className="mr-2 size-4" />
            {t('add.travel')}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <DefaultLoading />
        ) : voyages.length === 0 ? (
          <DefaultEmptyData />
        ) : (
          <ItemGroup>
            {voyages.map((item: any) => (
              <Item key={item.id} variant="outline" className="cursor-pointer" onClick={() => navigate({ to: '/voyage/kpis-travel/add', search: { id: item.id } })}>
                <div className="flex flex-1 items-center gap-4">
                  <ItemMedia variant="image">
                    <Ship className="size-5" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle className="text-base">{item.code || item.name}</ItemTitle>
                    <ItemDescription>{item.machine?.name || item.asset?.label}</ItemDescription>
                    <ItemDescription>{item.status}</ItemDescription>
                  </ItemContent>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-end border-l pl-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate({ to: '/voyage/kpis-travel/add', search: { id: item.id } });
                          }}
                        >
                          <Pencil className="mr-2 size-4" />
                          {t('edit')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => handleDelete(item.id, e)} className="text-destructive focus:text-destructive">
                          <Trash2 className="mr-2 size-4" />
                          {t('delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </Item>
            ))}
          </ItemGroup>
        )}
      </CardContent>

      {totalCount > 0 && (
        <CardFooter layout="multi">
          <div className="order-2 flex items-center gap-2 text-muted-foreground text-sm sm:order-1">
            <span>{t('show')}</span>
            <Select value={String(size)} onValueChange={(val) => navigate({ search: (prev: VoyageSearch) => ({ ...prev, size: Number(val), page: 1 }) })}>
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
                      if (page > 1) navigate({ search: (prev: VoyageSearch) => ({ ...prev, page: page - 1 }) });
                    }}
                    aria-disabled={page <= 1}
                    className={page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                <PaginationItem>
                  <span className="px-4">
                    {page} / {totalPages}
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page < totalPages) navigate({ search: (prev: VoyageSearch) => ({ ...prev, page: page + 1 }) });
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
