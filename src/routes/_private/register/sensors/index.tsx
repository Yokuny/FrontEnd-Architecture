import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { CloudUpload, Flashlight, MoreVertical, Plus, Search, Ship } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';
import EmptyStandard from '@/components/empty-standard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { useEnterpriseFilter } from '@/hooks/use-enterprises-api';
import { useSensors, useSensorsApi } from '@/hooks/use-sensors-api';

const sensorsSearchSchema = z.object({
  page: z.number().optional().default(1),
  size: z.number().optional().default(20),
  search: z.string().optional(),
});

type SensorsSearch = z.infer<typeof sensorsSearchSchema>;

export const Route = createFileRoute('/_private/register/sensors/')({
  component: SensorListPage,
  validateSearch: (search: Record<string, unknown>): SensorsSearch => sensorsSearchSchema.parse(search),
  beforeLoad: () => ({
    title: 'sensors',
  }),
});

function SensorListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate({ from: Route.fullPath });
  const { page, size, search } = useSearch({ from: '/_private/register/sensors/' });
  const { idEnterprise } = useEnterpriseFilter();

  const { data, isLoading } = useSensors(idEnterprise, page - 1, size, search);
  const { deleteSensor } = useSensorsApi();

  const sensors = data?.data || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / size);

  const handleDelete = async (id: string) => {
    try {
      await deleteSensor.mutateAsync(id);
      toast.success(t('delete.successfull'));
    } catch {
      toast.error(t('error.delete'));
    }
  };

  return (
    <Card>
      <CardHeader title={t('sensors')}>
        <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
          <div className="relative w-full sm:max-w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder={t('search')}
              className="pl-9"
              defaultValue={search || ''}
              onBlur={(e) => {
                if (e.target.value !== search) {
                  navigate({
                    search: (prev: SensorsSearch) => ({ ...prev, search: e.target.value || undefined, page: 1 }),
                  });
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate({
                    search: (prev: SensorsSearch) => ({ ...prev, search: e.currentTarget.value || undefined, page: 1 }),
                  });
                }
              }}
            />
          </div>
          <Button onClick={() => navigate({ to: '/register/sensors/add' })}>
            <Plus className="size-4 mr-2" />
            {t('sensor.new')}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <Skeleton className="h-48 w-full flex items-center justify-center">
            <Spinner />
          </Skeleton>
        ) : sensors.length === 0 ? (
          <EmptyStandard />
        ) : (
          <div className="grid gap-2">
            {sensors.map((item) => (
              <Item key={item.id} variant="outline" className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4 flex-1">
                  <ItemMedia className="size-10 rounded-full flex items-center justify-center bg-muted">
                    <Flashlight className="size-5 text-success-500" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle className="text-base">{item.sensor}</ItemTitle>
                    <ItemDescription>{item.enterprise?.name}</ItemDescription>
                  </ItemContent>
                </div>

                <div className="flex items-center gap-8 flex-1 justify-center">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap">
                    <CloudUpload className="size-4" />
                    <span>{item.sensorId}</span>
                  </div>
                  {item.machines && item.machines.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground max-w-[200px] truncate">
                      <Ship className="size-4 shrink-0" />
                      <span className="truncate">{item.machines.join(', ')}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end flex-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          navigate({
                            to: '/register/sensors/add',
                            search: { id: item.id },
                          })
                        }
                      >
                        {t('edit')}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(item.id)}>
                        {t('delete')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </Item>
            ))}
          </div>
        )}
      </CardContent>

      {totalCount > 0 && (
        <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t py-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground order-2 sm:order-1">
            <span>{t('show')}</span>
            <Select value={String(size)} onValueChange={(val) => navigate({ search: (prev: SensorsSearch) => ({ ...prev, size: Number(val), page: 1 }) })}>
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
                      if (page > 1) navigate({ search: (prev: SensorsSearch) => ({ ...prev, page: page - 1 }) });
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
                          navigate({ search: (prev: SensorsSearch) => ({ ...prev, page: pageNum }) });
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
                      if (page < totalPages) navigate({ search: (prev: SensorsSearch) => ({ ...prev, page: page + 1 }) });
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
