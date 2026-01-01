import { createFileRoute } from '@tanstack/react-router';
import { AppWindow, Bell, Copy, Globe, Lock, MoreVertical, Pencil, Plus, Thermometer, Users, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Item, ItemContent, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAlertsPaginated } from '@/hooks/use-alerts-api';
import { useEnterpriseFilter } from '@/hooks/use-enterprises-api';

const searchSchema = z.object({
  page: z.number().default(1),
  size: z.number().default(10),
  search: z.string().optional(),
});

export const Route = createFileRoute('/_private/register/alerts/')({
  component: AlertsListPage,
  validateSearch: (search) => searchSchema.parse(search),
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

  const handlePageChange = (newPage: number) => {
    navigate({
      search: (prev) => ({ ...prev, page: newPage }),
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader title={t('rule.alerts')} />
        <CardContent>
          <DefaultLoading />
        </CardContent>
      </Card>
    );
  }

  const alerts = data?.data || [];
  const totalCount = data?.pageInfo?.[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / size);

  return (
    <Card>
      <CardHeader title={t('rule.alerts')}>
        <Button onClick={() => navigate({ to: '/register/alerts/add' })}>
          <Plus className="mr-2 size-4" />
          {t('new.alarm')}
        </Button>
      </CardHeader>

      <CardContent>
        {alerts.length === 0 ? (
          <DefaultEmptyData />
        ) : (
          <div className="flex flex-col gap-2">
            {alerts.map((alert) => {
              const type = alert.type as 'min-max' | 'event' | 'conditional';
              const isEvent = type === 'event';
              const isMinMax = type === 'min-max';

              // Legacy Icon & Color Logic
              const getAlertIcon = () => {
                if (isEvent) return 'flash';
                if (isMinMax) return 'thermometer';
                return 'code';
              };

              // Tailwind colors matching legacy roughly
              // Success: text-green-500
              // Warning: text-orange-500
              // Info: text-blue-500
              const iconColorClass = isEvent ? 'text-green-500' : isMinMax ? 'text-orange-500' : 'text-blue-500';

              const iconName = getAlertIcon();
              const IconComponent = iconName === 'flash' ? Zap : iconName === 'thermometer' ? Thermometer : AppWindow; // Using Lucide approximations

              // Visibility Logic
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
                <Item key={alert.id} variant="outline" className="flex items-center justify-between p-4 mb-2 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4 flex-1">
                    <ItemMedia className="size-12 rounded-full overflow-hidden flex items-center justify-center bg-muted/30 border">
                      <Bell className={`size-6 ${iconColorClass}`} />
                    </ItemMedia>
                    <ItemContent className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      <div className="md:col-span-6">
                        <ItemTitle className="text-base font-semibold line-clamp-1">{description || '-'}</ItemTitle>
                      </div>

                      <div className="md:col-span-3 flex items-center gap-2">
                        <IconComponent className={`size-4 ${iconColorClass}`} />
                        <span className="text-sm text-muted-foreground capitalize">{t(type === 'min-max' ? 'min.max' : type)}</span>
                      </div>

                      <div className="md:col-span-3 flex items-center gap-2">
                        <VisibilityIcon className={`size-4 ${visibilityData.color}`} />
                        <span className="text-sm text-muted-foreground capitalize">{t(alert.visibility)}</span>
                      </div>
                    </ItemContent>
                  </div>

                  <div className="flex items-center gap-2 pl-4 border-l ml-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="size-4" />
                          <span className="sr-only">{t('actions')}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate({ to: '/register/alerts/add', search: { id: alert.id } })}>
                          <Pencil className="mr-2 size-4" />
                          {t('edit')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate({ to: '/register/alerts/add', search: { id: alert.id, duplicate: 'true' } })}>
                          <Copy className="mr-2 size-4" />
                          {t('duplicate')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </Item>
              );
            })}
          </div>
        )}
      </CardContent>

      {totalCount > 0 && (
        <CardFooter layout="multi">
          <div className="flex items-center gap-2 text-sm text-muted-foreground order-2 sm:order-1">
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
                    onClick={(e: React.MouseEvent) => {
                      e.preventDefault();
                      if (page > 1) handlePageChange(page - 1);
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
                        onClick={(e: React.MouseEvent) => {
                          e.preventDefault();
                          handlePageChange(pageNum);
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
                    onClick={(e: React.MouseEvent) => {
                      e.preventDefault();
                      if (page < totalPages) handlePageChange(page + 1);
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
