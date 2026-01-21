import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { MoreVertical, Plus, Search, Ship } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';
import EmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { usePlatforms, usePlatformsApi } from '@/hooks/use-platforms-api';

const platformsSearchSchema = z.object({
  page: z.number().catch(1).optional().default(1),
  size: z.number().catch(20).optional().default(20),
  search: z.string().optional(),
});

type PlatformsSearch = z.infer<typeof platformsSearchSchema>;

export const Route = createFileRoute('/_private/register/platform/')({
  component: PlatformListPage,
  validateSearch: (search: Record<string, unknown>): PlatformsSearch => platformsSearchSchema.parse(search),
  beforeLoad: () => ({
    title: 'platforms',
  }),
});

function PlatformListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate({ from: Route.fullPath });
  const { page, size, search } = useSearch({ from: '/_private/register/platform/' });
  const { idEnterprise } = useEnterpriseFilter();

  const { data, isLoading } = usePlatforms({
    idEnterprise,
    page: page - 1,
    size,
    search,
  });
  const { deletePlatform } = usePlatformsApi();

  const platforms = data?.data || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / size);

  const handleDelete = async (id: string) => {
    try {
      await deletePlatform.mutateAsync(id);
      toast.success(t('delete.success'));
    } catch {
      toast.error(t('error.delete'));
    }
  };

  return (
    <Card>
      <CardHeader title={t('platforms')}>
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
                    search: (prev: PlatformsSearch) => ({ ...prev, search: e.target.value || undefined, page: 1 }),
                  });
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate({
                    search: (prev: PlatformsSearch) => ({ ...prev, search: e.currentTarget.value || undefined, page: 1 }),
                  });
                }
              }}
            />
          </div>
          <Button onClick={() => navigate({ to: '/register/platform/add' })}>
            <Plus className="size-4 mr-2" />
            {t('add')}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <DefaultLoading />
        ) : platforms.length === 0 ? (
          <EmptyData />
        ) : (
          <ItemGroup>
            {platforms.map((item) => (
              <Item
                key={item.id}
                variant="outline"
                className="cursor-pointer"
                onClick={() =>
                  navigate({
                    to: '/register/platform/add',
                    search: { id: item.id },
                  })
                }
              >
                <div className="flex items-center gap-4 flex-1">
                  <ItemMedia variant="image">
                    <Ship className="size-5" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle className="text-base">{item.name}</ItemTitle>
                    <ItemDescription>{`${item.acronym || '-'} / ${item.modelType || '-'}`}</ItemDescription>
                    <ItemDescription>{item.enterprise?.name}</ItemDescription>
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
                            navigate({
                              to: '/register/platform/add',
                              search: { id: item.id },
                            });
                          }}
                        >
                          {t('edit')}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item.id);
                          }}
                        >
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
          <div className="flex items-center gap-2 text-sm text-muted-foreground order-2 sm:order-1">
            <span>{t('show')}</span>
            <Select value={String(size)} onValueChange={(val) => navigate({ search: (prev: PlatformsSearch) => ({ ...prev, size: Number(val), page: 1 }) })}>
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
                      if (page > 1) navigate({ search: (prev: PlatformsSearch) => ({ ...prev, page: page - 1 }) });
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
                          navigate({ search: (prev: PlatformsSearch) => ({ ...prev, page: pageNum }) });
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
                      if (page < totalPages) navigate({ search: (prev: PlatformsSearch) => ({ ...prev, page: page + 1 }) });
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
