import { createFileRoute } from '@tanstack/react-router';
import { Building2, Mail, MapPin, MessageSquare, MoreVertical, Pencil, Plus, Search, Settings, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import EmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type Enterprise, useEnterprisesPaginated } from '@/hooks/use-enterprises-api';

// import { useHasPermission } from '@/hooks/use-permissions';

const enterprisesSearchSchema = z.object({
  page: z.number().catch(1).optional().default(1),
  size: z.number().catch(10).optional().default(10),
  search: z.string().optional(),
});

type EnterprisesSearch = z.infer<typeof enterprisesSearchSchema>;

export const Route = createFileRoute('/_private/register/enterprises/')({
  component: EnterprisesListPage,
  validateSearch: (search: Record<string, unknown>): EnterprisesSearch => enterprisesSearchSchema.parse(search),
  beforeLoad: () => ({
    title: 'enterprises',
  }),
});

function EnterprisesListPage() {
  const { t } = useTranslation();
  const navigate = Route.useNavigate();
  const { page, size, search } = Route.useSearch();

  const { data, isLoading } = useEnterprisesPaginated({
    page: page - 1,
    size: size,
    search: search,
  });

  const enterprises = data?.data || [];
  const total = data?.pageInfo?.[0]?.count || 0;
  const totalPages = Math.ceil(total / size);

  // const hasPermissionAdd = useHasPermission('/organization-add');

  const renderEnterpriseItem = (item: Enterprise) => {
    return (
      <Item key={item.id} variant="outline" className="cursor-pointer" onClick={() => navigate({ to: '/register/enterprises/add', search: { id: item.id } })}>
        <div className="flex flex-1 items-center gap-4">
          <ItemMedia variant="image">
            {item.image?.url ? <img src={item.image.url} alt={item.name} className="size-full object-cover" /> : <Building2 className="size-5" />}
          </ItemMedia>
          <ItemContent className="gap-0">
            <ItemTitle className="text-base">{item.name}</ItemTitle>
            <ItemDescription className="flex items-center gap-1">
              <MapPin className="size-3" />
              {item.city} - {item.state} {item.country && `/ ${item.country}`}
            </ItemDescription>
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
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate({ to: '/register/enterprises/add', search: { id: item.id } });
                  }}
                >
                  <Pencil className="mr-2 size-4" />
                  {t('edit')}
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate({ to: '/set-up-company/setup-email', search: { id: item.id } });
                  }}
                >
                  <Mail className="mr-2 size-4" />
                  {t('setup.email')}
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate({ to: '/set-up-company/setup-chatbot', search: { id: item.id } });
                  }}
                >
                  <MessageSquare className="mr-2 size-4" />
                  {t('setup.chatbot')}
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate({ to: '/set-up-company/external-users', search: { id: item.id } });
                  }}
                >
                  <Users className="mr-2 size-4" />
                  {t('usernames.external')}
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate({ to: '/set-up-company/setup-limits', search: { id: item.id } });
                  }}
                >
                  <Settings className="mr-2 size-4" />
                  {t('setup.limits')}
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate({ to: '/set-up-company/setup-fleet', search: { id: item.id } });
                  }}
                >
                  <Settings className="mr-2 size-4" />
                  {t('config')} Fleet
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Item>
    );
  };

  return (
    <Card>
      <CardHeader title={t('enterprises')}>
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
                    search: (prev: EnterprisesSearch) => ({ ...prev, search: e.target.value || undefined, page: 1 }),
                  });
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate({
                    search: (prev: EnterprisesSearch) => ({ ...prev, search: e.currentTarget.value || undefined, page: 1 }),
                  });
                }
              }}
            />
          </div>
          {/* {hasPermissionAdd && ( */}
          <Button onClick={() => navigate({ to: '/register/enterprises/add' })}>
            <Plus className="mr-2 size-4" />
            {t('add')}
          </Button>
          {/* )} */}
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? <DefaultLoading /> : enterprises.length === 0 ? <EmptyData /> : <ItemGroup>{enterprises.map((item) => renderEnterpriseItem(item))}</ItemGroup>}
      </CardContent>

      {total > 0 && (
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
                      if (page > 1) navigate({ search: (prev) => ({ ...prev, page: page - 1 }) });
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
                          navigate({ search: (prev) => ({ ...prev, page: pageNum }) });
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
                      if (page < totalPages) navigate({ search: (prev) => ({ ...prev, page: page + 1 }) });
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
