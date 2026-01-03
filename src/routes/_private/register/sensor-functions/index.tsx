import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { FunctionSquare, MoreVertical, Plus, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import EmptyData from '@/components/default-empty-data';
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
import { useSensorFunctions } from '@/hooks/use-sensor-functions-api';
import { replacePlaceholdersWithArray } from './@consts/sensor-function-utils';

const sensorFunctionsSearchSchema = z.object({
  page: z.number().catch(1).optional(),
  size: z.number().catch(20).optional(),
  search: z.string().optional(),
});

type SensorFunctionsSearch = z.infer<typeof sensorFunctionsSearchSchema>;

export const Route = createFileRoute('/_private/register/sensor-functions/')({
  component: SensorFunctionsListPage,
  validateSearch: (search: Record<string, unknown>): SensorFunctionsSearch => sensorFunctionsSearchSchema.parse(search),
  beforeLoad: () => ({
    title: 'sensor.functions',
  }),
});

function SensorFunctionsListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate({ from: Route.fullPath });
  const { page = 1, size = 20, search } = useSearch({ from: '/_private/register/sensor-functions/' });
  const { idEnterprise } = useEnterpriseFilter();

  const { data, isLoading } = useSensorFunctions({
    idEnterprise: idEnterprise || '',
    page,
    size,
    description: search,
  });

  const sensorFunctions = data?.data || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / size);

  return (
    <Card>
      <CardHeader title={t('sensor.functions')}>
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
                    search: (prev: SensorFunctionsSearch) => ({ ...prev, search: e.target.value || undefined, page: 1 }),
                  });
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate({
                    search: (prev: SensorFunctionsSearch) => ({ ...prev, search: e.currentTarget.value || undefined, page: 1 }),
                  });
                }
              }}
            />
          </div>
          <Button onClick={() => navigate({ to: '/register/sensor-functions/add' })} disabled={!idEnterprise}>
            <Plus className="size-4 mr-2" />
            {t('add')}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <DefaultLoading />
        ) : sensorFunctions.length === 0 ? (
          <EmptyData />
        ) : (
          <ItemGroup>
            {sensorFunctions.map((item) => (
              <Item
                key={item.id || item._id}
                variant="outline"
                className={`cursor-pointer ${!item.enabled ? 'opacity-50 grayscale bg-muted/50' : ''}`}
                onClick={() =>
                  navigate({
                    to: '/register/sensor-functions/add',
                    search: { id: item.id || item._id },
                  })
                }
              >
                <div className="flex items-center gap-4 flex-1">
                  <ItemMedia variant="image">
                    <FunctionSquare className={`size-5 ${item.enabled ? 'text-primary' : 'text-muted-foreground'}`} />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle className="text-base">{item.description}</ItemTitle>
                    <ItemDescription className="font-mono text-xs">{replacePlaceholdersWithArray(item.algorithm, item.sensorsIn)}</ItemDescription>
                  </ItemContent>
                </div>

                <div className="hidden md:flex items-center justify-center overflow-hidden">
                  {item.machines && item.machines.length > 0 && (
                    <div className="flex flex-wrap gap-1 justify-center max-h-[40px] overflow-y-auto">
                      {item.machines.map((machine, idx) => (
                        <Badge key={machine.value || idx} variant="outline">
                          {machine.label}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  {!item.enabled && <Badge>{t('deactivate')}</Badge>}
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
                            navigate({
                              to: '/register/sensor-functions/add',
                              search: { id: item.id || item._id },
                            });
                          }}
                        >
                          {t('edit')}
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

      {total > 0 && (
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
              {t('total')}: {total}
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
                      if (page > 1) navigate({ search: (prev: SensorFunctionsSearch) => ({ ...prev, page: page - 1 }) });
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
                          navigate({ search: (prev: SensorFunctionsSearch) => ({ ...prev, page: pageNum }) });
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
                      if (page < totalPages) navigate({ search: (prev: SensorFunctionsSearch) => ({ ...prev, page: page + 1 }) });
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
