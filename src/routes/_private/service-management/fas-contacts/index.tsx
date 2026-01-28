import { createFileRoute } from '@tanstack/react-router';
import { Edit, MoreVertical, Search, Users } from 'lucide-react';
import { useState } from 'react';
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
import type { FasSupplier } from '@/hooks/use-fas-api';
import { useFasSuppliersPaginated } from '@/hooks/use-fas-api';
import { SupplierContactsDialog } from './@components/supplier-contacts-dialog';

const fasContactsSearchSchema = z.object({
  page: z.number().optional().default(1),
  size: z.number().optional().default(10),
  search: z.string().optional(),
});

export const Route = createFileRoute('/_private/service-management/fas-contacts/')({
  component: FasContactsPage,
  validateSearch: (search: Record<string, unknown>): FasContactsSearch => fasContactsSearchSchema.parse(search),
});

function FasContactsPage() {
  const { t } = useTranslation();
  const navigate = Route.useNavigate();
  const { page, size, search } = Route.useSearch();

  const [selectedSupplier, setSelectedSupplier] = useState<FasSupplier | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data, isLoading } = useFasSuppliersPaginated({
    page: page - 1,
    size,
    search,
  });

  const suppliers = data?.data || [];
  const totalCount = data?.pageInfo?.[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / size);

  const handleEditSupplier = (supplier: FasSupplier) => {
    setSelectedSupplier(supplier);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedSupplier(null);
  };

  return (
    <>
      <Card>
        <CardHeader title={t('fas.contacts')}>
          <div className="relative w-full sm:max-w-64">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t('search')}
              className="pl-9"
              defaultValue={search || ''}
              onBlur={(e) => {
                if (e.target.value !== search) {
                  navigate({
                    search: (prev: FasContactsSearch) => ({ ...prev, search: e.target.value || undefined, page: 1 }),
                  });
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate({
                    search: (prev: FasContactsSearch) => ({ ...prev, search: e.currentTarget.value || undefined, page: 1 }),
                  });
                }
              }}
            />
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <DefaultLoading />
          ) : suppliers.length === 0 ? (
            <DefaultEmptyData />
          ) : (
            <ItemGroup>
              {suppliers.map((supplier) => (
                <Item key={`${supplier.razao}-${supplier.codigoFornecedor}`} variant="outline">
                  <div className="flex flex-1 items-center gap-4">
                    <ItemMedia variant="icon">
                      <Users className="size-5 text-blue-600" />
                    </ItemMedia>
                    <ItemTitle>{supplier.razao || 'N/A'}</ItemTitle>
                  </div>

                  <div className="flex flex-col items-end text-muted-foreground">
                    {supplier.contacts?.map((contact) => (
                      <div key={contact.id} className="flex items-center gap-1">
                        <ItemDescription>{contact.email || 'N/A'}</ItemDescription>
                        {contact.role === 'admin' && <ItemTitle className="text-xs">(Admin)</ItemTitle>}
                        {contact.role === 'default' && <ItemTitle className="text-xs">({t('default')})</ItemTitle>}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-end border-l pl-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditSupplier(supplier)}>
                          <Edit className="mr-2 size-4" />
                          {t('edit')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
                        if (page > 1) navigate({ search: (prev: FasContactsSearch) => ({ ...prev, page: page - 1 }) });
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
                            navigate({ search: (prev: FasContactsSearch) => ({ ...prev, page: pageNum }) });
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
                        if (page < totalPages) navigate({ search: (prev: FasContactsSearch) => ({ ...prev, page: page + 1 }) });
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

      <SupplierContactsDialog supplier={selectedSupplier} open={dialogOpen} onClose={handleCloseDialog} />
    </>
  );
}

type FasContactsSearch = z.infer<typeof fasContactsSearchSchema>;
