import { createFileRoute } from '@tanstack/react-router';
import { Anchor, Bell, Building2, CloudUpload, Flashlight, Map as MapIcon, MoreVertical, Navigation, Pencil, Plus, Search, Ship } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { useMachines } from '@/hooks/use-machines-api';
import { IncludeVesselModal } from './@components/include-vessel-modal';

const machinesSearchSchema = z.object({
  page: z.number().optional().default(1),
  size: z.number().optional().default(10),
  search: z.string().optional(),
});

type MachinesSearch = z.infer<typeof machinesSearchSchema>;

export const Route = createFileRoute('/_private/register/machines/')({
  component: MachineListPage,
  validateSearch: (search: Record<string, unknown>): MachinesSearch => machinesSearchSchema.parse(search),
});

function MachineListPage() {
  const { t } = useTranslation();
  const navigate = Route.useNavigate();
  const { page, size, search } = Route.useSearch();
  const { idEnterprise } = useEnterpriseFilter();
  const [isIncludeVesselOpen, setIsIncludeVesselOpen] = useState(false);

  const { data, isLoading } = useMachines({
    idEnterprise,
    search: search || undefined,
    page: page - 1,
    size,
  });

  const machines = data?.data || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / size);

  return (
    <Card>
      <CardHeader title={t('assets')}>
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
                    search: (prev: MachinesSearch) => ({ ...prev, search: e.target.value || undefined, page: 1 }),
                  });
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate({
                    search: (prev: MachinesSearch) => ({ ...prev, search: e.currentTarget.value || undefined, page: 1 }),
                  });
                }
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setIsIncludeVesselOpen(true)}>
              <Anchor className="mr-2 size-4" />
              {t('vessel.include')}
            </Button>
            <Button onClick={() => navigate({ to: '/register/machines/add' } as any)}>
              <Plus className="mr-2 size-4" />
              {t('add')}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <DefaultLoading />
        ) : !machines.length ? (
          <DefaultEmptyData />
        ) : (
          <ItemGroup>
            {machines.map((machine) => (
              <Item key={machine.id} variant="outline" className="cursor-pointer" onClick={() => navigate({ to: `/register/machines/add`, search: { id: machine._id } })}>
                <div className="flex flex-1 items-center gap-4">
                  <ItemMedia variant="image">
                    {machine.image?.url ? <img src={machine.image.url} alt={machine.name} className="size-full object-cover" /> : <Ship className="size-5" />}
                  </ItemMedia>
                  <ItemContent className="gap-0">
                    <ItemTitle className="text-base">{machine.name}</ItemTitle>
                    <ItemDescription className="flex items-center gap-2">
                      <Building2 className="size-3 shrink-0 text-muted-foreground" />
                      {machine.enterprise?.name || ''}
                      {machine.code && ` / ${machine.code}`}
                    </ItemDescription>
                  </ItemContent>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs">
                    <CloudUpload className="size-3" />
                    <ItemDescription className="tabular-nums">{machine.id}</ItemDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    {machine.isInactive ? (
                      <Badge variant="secondary" className="h-5 px-1.5 text-xs uppercase tracking-wider">
                        {t('deactivate')}
                      </Badge>
                    ) : (
                      <div className="flex items-center gap-3">
                        {machine.isConfiguredFleet && (
                          <div className="flex items-center gap-1 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                            <MapIcon className="size-3" />
                            <span>{t('show.in.fleet')}</span>
                          </div>
                        )}
                        {machine.isConfiguredTravel && (
                          <div className="flex items-center gap-1 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                            <Navigation className="size-3" />
                            <span>{t('setup.travel')}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                          <Flashlight className="size-3" />
                          <span>{`${machine.sensors || 0} ${t('sensors')}`}</span>
                        </div>
                      </div>
                    )}
                  </div>
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
                            navigate({ to: `/register/machines/add`, search: { id: machine._id } } as any);
                          }}
                        >
                          <Pencil className="mr-2 size-4" />
                          {t('edit')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                          <Bell className="mr-2 size-4" />
                          {t('editor.alarms.machine')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                          <Flashlight className="mr-2 size-4" />
                          {t('sensors')}
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
                      if (page > 1) navigate({ search: (prev: MachinesSearch) => ({ ...prev, page: page - 1 }) });
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
                          navigate({ search: (prev: MachinesSearch) => ({ ...prev, page: pageNum }) });
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
                      if (page < totalPages) navigate({ search: (prev: MachinesSearch) => ({ ...prev, page: page + 1 }) });
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

      <IncludeVesselModal isOpen={isIncludeVesselOpen} onClose={() => setIsIncludeVesselOpen(false)} idEnterprise={idEnterprise} />
    </Card>
  );
}
