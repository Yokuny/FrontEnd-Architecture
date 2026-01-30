import { createFileRoute } from '@tanstack/react-router';
import { Bell, Copy, Globe, Lock, MoreVertical, Pencil, Plus, Search, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAlertsPaginated } from '@/hooks/use-alerts-api';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';

const alertsSearchSchema = z.object({
  page: z.number().optional().default(1),
  size: z.number().optional().default(10),
  search: z.string().optional(),
});

export const Route = createFileRoute('/_private/register/alerts/')({
  component: AlertsListPage,
  validateSearch: (search: Record<string, unknown>): AlertsSearch => alertsSearchSchema.parse(search),
});

function AlertsListPage() {
  const { t } = useTranslation();
  const navigate = Route.useNavigate();
  const { page, size, search } = Route.useSearch();
  const { idEnterprise } = useEnterpriseFilter();

  const { data, isLoading } = useAlertsPaginated({
    page: page - 1,
    size,
    search,
    idEnterprise: idEnterprise || undefined,
  });

  const alerts = data?.data || [];
  const totalCount = data?.pageInfo?.[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / size);

  return (
    <Card>
      <CardHeader title={t('rule.alerts')}>
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
                    search: (prev: AlertsSearch) => ({ ...prev, search: e.target.value || undefined, page: 1 }),
                  });
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate({
                    search: (prev: AlertsSearch) => ({ ...prev, search: e.currentTarget.value || undefined, page: 1 }),
                  });
                }
              }}
            />
          </div>
          <Button onClick={() => navigate({ to: '/register/alerts/add' })}>
            <Plus className="mr-2 size-4" />
            {t('add')}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <DefaultLoading />
        ) : alerts.length === 0 ? (
          <DefaultEmptyData />
        ) : (
          <ItemGroup>
            {alerts.map((alert) => {
              const type = alert.type as 'min-max' | 'event' | 'conditional';
              const isEvent = type === 'event';
              const isMinMax = type === 'min-max';

              const iconColorClass = isEvent ? 'text-green-500' : isMinMax ? 'text-orange-500' : 'text-blue-500';

              const getVisibilityData = (vis: string) => {
                switch (vis) {
                  case 'public':
                    return { icon: Globe, color: 'text-green-500' };
                  case 'private':
                    return { icon: Lock, color: 'text-red-500' };
                  case 'limited':
                    return { icon: Users, color: 'text-orange-500' };
                  default:
                    return { icon: Lock, color: 'text-gray-500' };
                }
              };

              const visibilityData = getVisibilityData(alert.visibility);
              const VisibilityIcon = visibilityData.icon;

              const description = type === 'event' ? alert.events?.description : type === 'min-max' ? alert.description : alert.rule?.then?.message;

              return (
                <Item
                  key={alert.id}
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() =>
                    navigate({
                      to: '/register/alerts/add',
                      search: { id: alert.id },
                    })
                  }
                >
                  <div className="flex flex-1 items-center gap-4">
                    <ItemMedia variant="image">
                      <Bell className={`size-5 ${iconColorClass}`} />
                    </ItemMedia>
                    <ItemContent className="gap-0">
                      <ItemTitle className="text-base">{description || '-'}</ItemTitle>
                      <ItemDescription className="capitalize">{t(type === 'min-max' ? 'min.max' : type)}</ItemDescription>
                    </ItemContent>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <VisibilityIcon className={`size-4 ${visibilityData.color}`} />
                      <ItemDescription className="capitalize">{t(alert.visibility)}</ItemDescription>
                    </div>

                    <div className="ml-2 flex items-center justify-end border-l pl-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate({ to: '/register/alerts/add', search: { id: alert.id } });
                            }}
                          >
                            <Pencil className="mr-2 size-4" />
                            {t('edit')}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate({ to: '/register/alerts/add', search: { id: alert.id, duplicate: 'true' } });
                            }}
                          >
                            <Copy className="mr-2 size-4" />
                            {t('duplicate')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </Item>
              );
            })}
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
                      if (page > 1) navigate({ search: (prev: AlertsSearch) => ({ ...prev, page: page - 1 }) });
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
                          navigate({ search: (prev: AlertsSearch) => ({ ...prev, page: pageNum }) });
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
                      if (page < totalPages) navigate({ search: (prev: AlertsSearch) => ({ ...prev, page: page + 1 }) });
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

type AlertsSearch = z.infer<typeof alertsSearchSchema>;
