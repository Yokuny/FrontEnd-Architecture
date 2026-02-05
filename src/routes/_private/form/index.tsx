import { createFileRoute } from '@tanstack/react-router';
import { ArrowRight, FileText, MoreVertical, Plus, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
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
import { type Form, useFormsPaginated } from '@/hooks/use-forms-api';
import { type FormSearch, formSearchSchema } from './@interface/form.schema';

export const Route = createFileRoute('/_private/form/')({
  component: FormsPage,
  validateSearch: (search: Record<string, unknown>): FormSearch => formSearchSchema.parse(search),
  staticData: {
    title: 'forms',
    description:
      'Formulários dinâmicos - sistema de gestão de formulários customizáveis com templates reutilizáveis. Permite listar, buscar e acessar formulários preenchidos, suportando diferentes tipos e permissões de preenchimento',
    tags: ['form', 'formulário', 'template', 'dynamic', 'dinâmico', 'custom', 'filled', 'preenchido', 'checklist', 'survey', 'inspection', 'data-collection'],
    examplePrompts: [
      'Listar todos os formulários disponíveis',
      'Buscar formulário por nome',
      'Ver formulários preenchidos',
      'Criar novo preenchimento de formulário',
      'Filtrar formulários por tipo',
    ],
    searchParams: [
      { name: 'search', type: 'string', description: 'Termo de busca para filtrar formulários', example: 'inspeção' },
      { name: 'page', type: 'number', description: 'Número da página para paginação', example: '1' },
      { name: 'size', type: 'number', description: 'Quantidade de itens por página', example: '10' },
    ],
    relatedRoutes: [
      { path: '/_private/cmms/filled-form-cmms', relation: 'sibling', description: 'Formulários preenchidos do CMMS' },
      { path: '/_private/cmms', relation: 'sibling', description: 'Hub CMMS' },
    ],
    entities: ['Form', 'FilledForm', 'Enterprise', 'FormType'],
    capabilities: [
      'Listar formulários',
      'Buscar formulários',
      'Paginar resultados',
      'Ver formulários preenchidos',
      'Filtrar por empresa',
      'Verificar permissões de preenchimento',
      'Acessar detalhes do formulário',
    ],
  },
});

function FormsPage() {
  const { t } = useTranslation();
  const navigate = Route.useNavigate();
  const searchParams = Route.useSearch();
  const { idEnterprise } = useEnterpriseFilter();

  const { data, isLoading } = useFormsPaginated({
    idEnterprise: idEnterprise || '',
    page: (searchParams.page || 1) - 1,
    size: searchParams.size || 10,
    description: searchParams.search,
  });

  const forms = data?.data || [];
  const totalItems = data?.pageInfo?.count || 0;
  const pageSize = searchParams.size || 10;
  const page = searchParams.page || 1;
  const totalPages = Math.ceil(totalItems / pageSize);

  const handleSearch = (term: string) => {
    navigate({
      search: (prev) => ({ ...prev, search: term || undefined, page: 1 }),
    });
  };

  const handlePageChange = (newPage: number) => {
    navigate({ search: (prev) => ({ ...prev, page: newPage }) });
  };

  const handleSizeChange = (newSize: number) => {
    navigate({ search: (prev) => ({ ...prev, size: newSize, page: 1 }) });
  };

  const renderFormItem = (item: Form) => {
    return (
      <Item key={item.id || item._id} variant="outline" className="cursor-default">
        <div className="flex flex-1 items-center gap-4">
          <ItemMedia variant="image">
            <FileText className="size-5 text-primary" />
          </ItemMedia>
          <ItemContent className="gap-0">
            <ItemTitle className="text-base">{item.description}</ItemTitle>
            <ItemDescription>
              {item.code ? `${item.code} • ` : ''}
              {item.typeForm || 'Default'}
            </ItemDescription>
          </ItemContent>
        </div>

        <div className="flex items-center gap-4">
          {item.enterprise?.name && <ItemDescription>{item.enterprise.name}</ItemDescription>}

          <div className="flex items-center justify-end border-l pl-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {item.appliedPermissions?.canFill && (
                  <DropdownMenuItem
                    onClick={() => {
                      // Placeholder for future implementation of filling page
                      toast.info(t('functionality.not.implemented'));
                    }}
                  >
                    <Plus className="mr-2 size-4" />
                    {t('add.form')}
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => {
                    navigate({
                      to: '/cmms/filled-form-cmms',
                      search: { idForm: item.id || item._id },
                    });
                  }}
                >
                  <ArrowRight className="mr-2 size-4" />
                  {t('filled.forms')}
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
      <CardHeader title={t('forms')}>
        <div className="relative w-full sm:max-w-64">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t('search')}
            className="pl-9"
            defaultValue={searchParams.search || ''}
            onBlur={(e) => {
              if (e.target.value !== searchParams.search) {
                handleSearch(e.target.value);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch(e.currentTarget.value);
              }
            }}
          />
        </div>
      </CardHeader>

      <CardContent>{isLoading ? <DefaultLoading /> : forms.length === 0 ? <EmptyData /> : <ItemGroup>{forms.map((item) => renderFormItem(item))}</ItemGroup>}</CardContent>

      {totalItems > 0 && (
        <CardFooter layout="multi">
          <div className="order-2 flex items-center gap-2 text-muted-foreground text-sm sm:order-1">
            <span>{t('showing')}</span>
            <Select value={String(pageSize)} onValueChange={(val) => handleSizeChange(Number(val))}>
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
              {t('total')}: {totalItems}
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
                        onClick={(e) => {
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
                    onClick={(e) => {
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
