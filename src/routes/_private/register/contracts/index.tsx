import { createFileRoute } from '@tanstack/react-router';
import { Copy, FilePlus, FileText, MoreVertical, Pencil, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useContractsPaginated } from '@/hooks/use-contracts-api';
import { useEnterpriseFilter } from '@/hooks/use-enterprises-api';

const searchSchema = z.object({
  page: z.number().default(1),
  size: z.number().default(10),
  search: z.string().optional(),
});

export const Route = createFileRoute('/_private/register/contracts/')({
  component: ContractsListPage,
  validateSearch: (search) => searchSchema.parse(search),
});

function ContractsListPage() {
  const { t } = useTranslation();
  const navigate = Route.useNavigate();
  const { page, size, search } = Route.useSearch();
  const { idEnterprise } = useEnterpriseFilter();

  const { data, isLoading } = useContractsPaginated({
    page: page - 1,
    size,
    search,
    idEnterprise,
  });

  const handlePageChange = (newPage: number) => {
    navigate({
      search: (prev) => ({ ...prev, page: newPage }),
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader title={t('contract')} />
        <CardContent>
          <DefaultLoading />
        </CardContent>
      </Card>
    );
  }

  const contracts = data?.data || [];
  const totalCount = data?.pageInfo?.[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / size);

  return (
    <Card>
      <CardHeader title={t('contract')}>
        <Button onClick={() => navigate({ to: '/register/contracts/add' })}>
          <Plus className="mr-2 size-4" />
          {t('view.contract.add')}
        </Button>
      </CardHeader>

      <CardContent>
        {contracts.length === 0 ? (
          <DefaultEmptyData />
        ) : (
          <div className="flex flex-col gap-2">
            {contracts.map((contract) => (
              <Item
                key={contract.id}
                variant="outline"
                className="flex items-center justify-between p-4 mb-2"
                onClick={() => navigate({ to: '/register/contracts/add', search: { id: contract.id } })}
              >
                <div className="flex items-center gap-4 flex-1">
                  <ItemMedia className="size-12 rounded-lg overflow-hidden flex items-center justify-center bg-muted border">
                    <FileText className="size-6 text-muted-foreground" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle className="text-base font-bold">{contract.description}</ItemTitle>
                    <ItemDescription className="text-xs text-muted-foreground mt-1">{contract.customer}</ItemDescription>
                  </ItemContent>
                </div>

                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate({ to: '/register/contracts/add', search: { id: contract.id } })}>
                        <Pencil className="mr-2 size-4" />
                        {t('edit')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate({ to: '/register/contracts/add', search: { id: contract.id, duplicate: 'true' } })}>
                        <Copy className="mr-2 size-4" />
                        {t('duplicate')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate({ to: `/register/contracts/assets/${contract.id}` } as any)}>
                        <FilePlus className="mr-2 size-4" />
                        {t('view.contract.asset')}
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
