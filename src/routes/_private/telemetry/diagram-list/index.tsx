import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Calendar, Eye, LayoutGrid, MoreVertical, Plus, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { formatDate } from '@/lib/formatDate';
import { useDiagramList } from './@hooks/use-diagram-list';

// import { useHasPermission } from '@/hooks/use-permissions';

const searchParamsSchema = z.object({
  page: z.coerce.number().optional().default(0),
  search: z.string().optional(),
});

export const Route = createFileRoute('/_private/telemetry/diagram-list/')({
  component: DiagramListPage,
  validateSearch: (search: Record<string, unknown>): z.infer<typeof searchParamsSchema> => searchParamsSchema.parse(search),
  staticData: {
    title: 'telemetry.diagram-list',
    description:
      'Lista de diagramas técnicos e esquemáticos. Permite visualizar, criar e gerenciar diagramas de sistemas da embarcação, com busca, paginação e status ativo/inativo.',
    tags: ['diagrams', 'diagramas', 'schematics', 'technical-drawings', 'systems', 'engineering', 'documentation'],
    examplePrompts: ['Ver lista de diagramas técnicos', 'Criar novo diagrama de sistema', 'Buscar diagramas por descrição'],
    searchParams: [
      { name: 'page', type: 'number', description: 'Número da página (padrão: 0)' },
      { name: 'search', type: 'string', description: 'Termo de busca na descrição' },
    ],
    relatedRoutes: [
      { path: '/_private/telemetry', relation: 'parent', description: 'Hub de telemetria' },
      { path: '/_private/telemetry/diagram-list/diagram', relation: 'child', description: 'Visualização/edição de diagrama' },
    ],
    entities: ['Diagram'],
    capabilities: [
      'Listagem paginada de diagramas',
      'Busca por descrição',
      'Visualização de diagrama',
      'Criação de novos diagramas',
      'Status ativo/inativo',
      'Data de criação',
      'Paginação (20 itens por página)',
    ],
  },
});

function DiagramListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate({ from: Route.fullPath });
  const { page, search } = Route.useSearch();
  const { idEnterprise } = useEnterpriseFilter();

  const { data, isLoading } = useDiagramList(idEnterprise, page, 20, search);

  // const hasPermissionAdd = useHasPermission('/diagram-add');

  const updateSearch = (updates: Partial<z.infer<typeof searchParamsSchema>>) => {
    navigate({ search: (prev: z.infer<typeof searchParamsSchema>) => ({ ...prev, ...updates }) });
  };

  return (
    <Card>
      <CardHeader title={t('diagram')}>
        <div className="flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row">
          <div className="relative w-full sm:max-w-64">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t('search')}
              className="pl-9"
              defaultValue={search || ''}
              onBlur={(e) => {
                if (e.target.value !== search) {
                  updateSearch({ search: e.target.value || undefined, page: 0 });
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  updateSearch({ search: e.currentTarget.value || undefined, page: 0 });
                }
              }}
            />
          </div>
          {/* {hasPermissionAdd && ( */}
          <Button onClick={() => navigate({ to: '/telemetry/diagram-list/diagram' })}>
            <Plus className="mr-2 size-4" />
            {t('diagram.new')}
          </Button>
          {/* )} */}
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <DefaultLoading />
        ) : !data?.data.length ? (
          <DefaultEmptyData />
        ) : (
          <ItemGroup>
            {data.data.map((item) => (
              <Item key={item.id} variant="outline" className="cursor-pointer" onClick={() => navigate({ to: '/telemetry/diagram-list/diagram', search: { id: item.id } })}>
                <div className="flex flex-1 items-center gap-4">
                  <ItemMedia variant="image">
                    <LayoutGrid className="size-5 text-primary" />
                  </ItemMedia>
                  <ItemContent className="gap-0">
                    <ItemTitle className="text-base">{item.description}</ItemTitle>
                    {item.isInactive ? <ItemDescription>{t('inactive')}</ItemDescription> : <ItemDescription>{t('diagram')}</ItemDescription>}
                  </ItemContent>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-muted-foreground" />
                    <ItemDescription>{formatDate(item.createAt, 'PP')}</ItemDescription>
                  </div>

                  <div className="ml-2 flex items-center justify-end border-l pl-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate({ to: '/telemetry/diagram-list/diagram', search: { id: item.id } });
                          }}
                        >
                          <Eye className="mr-2 size-4" />
                          {t('view')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </Item>
            ))}

            {data.totalCount > 20 && (
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious onClick={() => updateSearch({ page: Math.max(0, page - 1) })} className={page === 0 ? 'pointer-events-none opacity-50' : ''} />
                  </PaginationItem>
                  <PaginationItem>
                    <span className="px-4 text-muted-foreground text-sm">
                      {t('page')} {page + 1} / {Math.ceil(data.totalCount / 20)}
                    </span>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => updateSearch({ page: page + 1 })}
                      className={page >= Math.ceil(data.totalCount / 20) - 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </ItemGroup>
        )}
      </CardContent>
    </Card>
  );
}
