import { createFileRoute } from '@tanstack/react-router';
import { Copy, FilePlus, FileText, MoreVertical, Pencil, Plus, Search } from 'lucide-react';
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
import { useContractsPaginated } from '@/hooks/use-contracts-api';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';

// import { useHasPermission } from '@/hooks/use-permissions';

const contractsSearchSchema = z.object({
  page: z.number().optional().default(1),
  size: z.number().optional().default(10),
  search: z.string().optional(),
});

type ContractsSearch = z.infer<typeof contractsSearchSchema>;

export const Route = createFileRoute('/_private/register/contracts/')({
  component: ContractsListPage,
  validateSearch: (search: Record<string, unknown>): ContractsSearch => contractsSearchSchema.parse(search),
  staticData: {
    title: 'register.contracts',
    description: 'Página de cadastro e gerenciamento de contratos. Permite criar, visualizar, editar, duplicar e visualizar ativos vinculados aos contratos com busca e paginação.',
    tags: ['register', 'cadastro', 'crud', 'management', 'gestão', 'contratos', 'contracts', 'acordos', 'clientes'],
    examplePrompts: [
      'Cadastrar novo contrato',
      'Listar todos os contratos',
      'Editar contrato',
      'Buscar contrato por descrição',
      'Duplicar contrato',
      'Visualizar ativos do contrato',
    ],
    searchParams: [
      { name: 'page', type: 'number', description: 'Número da página', example: '1' },
      { name: 'size', type: 'number', description: 'Itens por página', example: '10' },
      { name: 'search', type: 'string', description: 'Termo de busca', example: 'contrato' },
    ],
    relatedRoutes: [
      { path: '/_private/register', relation: 'parent', description: 'Hub de cadastros' },
      { path: '/_private/register/contracts/assets/$id', relation: 'child', description: 'Ativos do contrato' },
    ],
    entities: ['Contract', 'Customer', 'Enterprise'],
    capabilities: [
      'Listar contratos com paginação',
      'Buscar por termo',
      'Filtrar por empresa',
      'Criar novo contrato',
      'Editar contrato existente',
      'Duplicar contrato',
      'Visualizar ativos vinculados ao contrato',
    ],
  },
});

function ContractsListPage() {
  const { t } = useTranslation();
  const navigate = Route.useNavigate();
  const { page, size, search } = Route.useSearch();
  const { idEnterprise } = useEnterpriseFilter();

  // const hasPermissionAdd = useHasPermission('/contract-add');

  const { data, isLoading } = useContractsPaginated({
    page: page - 1,
    size,
    search,
    idEnterprise,
  });

  const contracts = data?.data || [];
  const totalCount = data?.pageInfo?.[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / size);

  return (
    <Card>
      <CardHeader title={t('contract')}>
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
                    search: (prev: ContractsSearch) => ({ ...prev, search: e.target.value || undefined, page: 1 }),
                  });
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate({
                    search: (prev: ContractsSearch) => ({ ...prev, search: e.currentTarget.value || undefined, page: 1 }),
                  });
                }
              }}
            />
          </div>
          {/* {hasPermissionAdd && ( */}
          <Button onClick={() => navigate({ to: '/register/contracts/add' })}>
            <Plus className="mr-2 size-4" />
            {t('add')}
          </Button>
          {/* )} */}
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <DefaultLoading />
        ) : contracts.length === 0 ? (
          <DefaultEmptyData />
        ) : (
          <ItemGroup>
            {contracts.map((contract) => (
              <Item key={contract.id} variant="outline" className="cursor-pointer" onClick={() => navigate({ to: '/register/contracts/add', search: { id: contract.id } })}>
                <div className="flex flex-1 items-center gap-4">
                  <ItemMedia variant="image">
                    <FileText className="size-5" />
                  </ItemMedia>
                  <ItemContent className="gap-0">
                    <ItemTitle className="text-base">{contract.description}</ItemTitle>
                    <ItemDescription>{contract.customer}</ItemDescription>
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
                            navigate({ to: '/register/contracts/add', search: { id: contract.id } });
                          }}
                        >
                          <Pencil className="mr-2 size-4" />
                          {t('edit')}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate({ to: '/register/contracts/add', search: { id: contract.id, duplicate: 'true' } });
                          }}
                        >
                          <Copy className="mr-2 size-4" />
                          {t('duplicate')}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate({ to: `/register/contracts/assets/${contract.id}` } as any);
                          }}
                        >
                          <FilePlus className="mr-2 size-4" />
                          {t('view.contract.asset')}
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
                      if (page > 1) navigate({ search: (prev: ContractsSearch) => ({ ...prev, page: page - 1 }) });
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
                          navigate({ search: (prev: ContractsSearch) => ({ ...prev, page: pageNum }) });
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
                      if (page < totalPages) navigate({ search: (prev: ContractsSearch) => ({ ...prev, page: page + 1 }) });
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
