import { createFileRoute } from '@tanstack/react-router';
import { Building2, MoreVertical, Pencil, Plus, Search, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Item, ItemContent, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCustomersPaginated } from '@/hooks/use-customers-api';
import { useEnterpriseFilter } from '@/hooks/use-enterprises-api';

const searchSchema = z.object({
  page: z.number().default(1),
  size: z.number().default(10),
  search: z.string().optional(),
});

export const Route = createFileRoute('/_private/register/customers/')({
  component: CustomersListPage,
  validateSearch: (search) => searchSchema.parse(search),
});

function CustomersListPage() {
  const { t } = useTranslation();
  const navigate = Route.useNavigate();
  const { page, size, search } = Route.useSearch();
  const { idEnterprise } = useEnterpriseFilter();

  const { data, isLoading } = useCustomersPaginated({
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
        <CardHeader title={t('customers')} />
        <CardContent>
          <DefaultLoading />
        </CardContent>
      </Card>
    );
  }

  const customers = data?.data || [];
  const totalCount = data?.pageInfo?.[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / size);

  return (
    <Card>
      <CardHeader title={t('customers')}>
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
          <Button onClick={() => navigate({ to: '/register/customers/add' } as any)}>
            <Plus className="size-4 mr-2" />
            {t('add')}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {customers.length === 0 ? (
          <DefaultEmptyData />
        ) : (
          <div className="flex flex-col gap-2">
            {customers.map((customer) => {
              return (
                <Item key={customer.id} variant="outline" className="flex items-center justify-between p-4 mb-2 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4 flex-1">
                    <ItemMedia className="size-12 rounded-full overflow-hidden flex items-center justify-center bg-muted/30 border">
                      <User className="size-6" />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle className="text-base font-semibold line-clamp-1">{customer.name}</ItemTitle>
                      {customer.enterprise && (
                        <div className=" flex items-center gap-2">
                          <Building2 className="size-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground line-clamp-1">
                            {customer.code ? `${customer.code} / ` : ''}
                            {customer.enterprise.name}
                          </span>
                        </div>
                      )}
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
                        <DropdownMenuItem onClick={() => navigate({ to: '/register/customers/add', search: { id: customer.id } } as any)}>
                          <Pencil className="mr-2 size-4" />
                          {t('edit')}
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
