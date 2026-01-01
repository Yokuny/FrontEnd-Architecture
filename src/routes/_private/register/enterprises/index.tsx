import { createFileRoute } from '@tanstack/react-router';
import { Building2, Mail, MapPin, MessageSquare, MoreVertical, Pencil, Plus, Search, Settings, ShieldCheck, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import EmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type Enterprise, useEnterprisesPaginated } from '@/hooks/use-enterprises-api';

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

  // For migration purposes, we assume some permissions are true or come from the item in future
  const hasPermissionAdd = true;

  const renderEnterpriseItem = (item: Enterprise) => {
    return (
      <Item key={item.id} variant="outline" className="flex items-center justify-between p-4 mb-2">
        <div className="flex items-center gap-4 flex-1">
          <ItemMedia className="size-12 rounded-full overflow-hidden flex items-center justify-center bg-muted border">
            {item.image?.url ? <img src={item.image.url} alt={item.name} className="size-full object-cover" /> : <Building2 className="size-6 text-muted-foreground" />}
          </ItemMedia>
          <ItemContent>
            <ItemTitle className="text-base font-bold">{item.name}</ItemTitle>
            <ItemDescription className="text-xs text-muted-foreground flex flex-wrap items-center gap-3 mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="size-3" />
                {item.city} - {item.state} {item.country && `/ ${item.country}`}
              </span>
            </ItemDescription>
          </ItemContent>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => navigate({ to: '/register/enterprises/add', search: { id: item.id } })}>
                <Pencil className="size-4 mr-2" />
                {t('edit')}
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => navigate({ to: '/set-up-company/setup-email', search: { id: item.id } })}>
                <Mail className="size-4 mr-2" />
                {t('setup.email')}
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => navigate({ to: '/set-up-company/setup-chatbot', search: { id: item.id } })}>
                <MessageSquare className="size-4 mr-2" />
                {t('setup.chatbot')}
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => navigate({ to: '/set-up-company/integration-list', search: { id: item.id } })}>
                <Users className="size-4 mr-2" />
                {t('usernames.external')}
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => navigate({ to: '/set-up-company/setup-limits', search: { id: item.id } })}>
                <Settings className="size-4 mr-2" />
                {t('setup.limits')}
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => navigate({ to: '/set-up-company/setup-sso', search: { id: item.id } })}>
                <ShieldCheck className="size-4 mr-2" />
                {t('setup.sso')}
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => navigate({ to: '/set-up-company/setup-fleet', search: { id: item.id } })}>
                <Settings className="size-4 mr-2" />
                {t('setup')} Fleet
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Item>
    );
  };

  return (
    <Card>
      <CardHeader title={t('enterprises')}>
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
                    search: (prev) => ({ ...prev, search: e.target.value || undefined, page: 1 }),
                  });
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate({
                    search: (prev) => ({ ...prev, search: e.currentTarget.value || undefined, page: 1 }),
                  });
                }
              }}
            />
          </div>
          {hasPermissionAdd && (
            <Button onClick={() => navigate({ to: '/register/enterprises/add' })}>
              <Plus className="size-4 mr-2" />
              {t('enterprise.new')}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? <DefaultLoading /> : enterprises.length === 0 ? <EmptyData /> : <div className="space-y-1">{enterprises.map((item) => renderEnterpriseItem(item))}</div>}
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
