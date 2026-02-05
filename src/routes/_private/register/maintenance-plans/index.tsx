import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { Building2, Edit2, MoreVertical, Plus, Search, Settings, Trash2 } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';
import EmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { useMaintenancePlans, useMaintenancePlansApi } from '@/hooks/use-maintenance-plans-api';

// import { useHasPermission } from '@/hooks/use-permissions';

const maintenancePlansSearchSchema = z.object({
  page: z.number().catch(1).optional().default(1),
  size: z.number().catch(20).optional().default(20),
  search: z.string().optional(),
});

type MaintenancePlansSearch = z.infer<typeof maintenancePlansSearchSchema>;

export const Route = createFileRoute('/_private/register/maintenance-plans/')({
  component: MaintenancePlansListPage,
  validateSearch: (search: Record<string, unknown>): MaintenancePlansSearch => maintenancePlansSearchSchema.parse(search),
  beforeLoad: () => ({
    title: 'maintenance.plans',
  }),
  staticData: {
    title: 'register.maintenance-plans',
    description: 'Página de cadastro e gerenciamento de planos de manutenção preventiva. Permite criar, visualizar, editar e deletar planos com busca e paginação.',
    tags: ['register', 'cadastro', 'crud', 'management', 'gestão', 'manutenção', 'maintenance', 'planos', 'plans', 'preventiva', 'CMMS'],
    examplePrompts: [
      'Cadastrar novo plano de manutenção',
      'Listar todos os planos de manutenção',
      'Editar plano de manutenção',
      'Buscar plano por descrição',
      'Deletar plano de manutenção',
    ],
    searchParams: [
      { name: 'page', type: 'number', description: 'Número da página', example: '1' },
      { name: 'size', type: 'number', description: 'Itens por página', example: '20' },
      { name: 'search', type: 'string', description: 'Termo de busca', example: 'preventiva' },
    ],
    relatedRoutes: [{ path: '/_private/register', relation: 'parent', description: 'Hub de cadastros' }],
    entities: ['MaintenancePlan', 'Enterprise'],
    capabilities: [
      'Listar planos de manutenção com paginação',
      'Buscar por termo',
      'Filtrar por empresa',
      'Criar novo plano de manutenção',
      'Editar plano existente',
      'Deletar plano com confirmação',
    ],
  },
});

function MaintenancePlansListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate({ from: Route.fullPath });
  const { page, size, search } = useSearch({ from: '/_private/register/maintenance-plans/' });
  const { idEnterprise } = useEnterpriseFilter();
  const { deleteMaintenancePlan } = useMaintenancePlansApi();

  // const hasPermissionAdd = useHasPermission('/maintenance-plan-add');

  const { data, isLoading } = useMaintenancePlans({
    page: page - 1,
    size,
    search,
    idEnterprise,
  });

  const plans = data?.data || [];
  const totalCount = data?.pageInfo?.[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / size);

  const [idToDelete, setIdToDelete] = React.useState<string | null>(null);

  const handleDelete = async () => {
    if (!idToDelete) return;
    try {
      await deleteMaintenancePlan.mutateAsync(idToDelete);
      toast.success(t('delete.success'));
      setIdToDelete(null);
    } catch {
      toast.error(t('error.delete'));
    }
  };

  return (
    <Card>
      <CardHeader title={t('maintenance.plans')}>
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
                    search: (prev: MaintenancePlansSearch) => ({
                      ...prev,
                      search: e.target.value || undefined,
                      page: 1,
                    }),
                  });
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate({
                    search: (prev: MaintenancePlansSearch) => ({
                      ...prev,
                      search: e.currentTarget.value || undefined,
                      page: 1,
                    }),
                  });
                }
              }}
            />
          </div>
          {/* {hasPermissionAdd && ( */}
          <Button onClick={() => navigate({ to: '/register/maintenance-plans/add' })}>
            <Plus className="mr-2 size-4" />
            {t('add')}
          </Button>
          {/* )} */}
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <DefaultLoading />
        ) : plans.length === 0 ? (
          <EmptyData />
        ) : (
          <ItemGroup>
            {plans.map((item) => (
              <Item
                key={item.id}
                variant="outline"
                className="cursor-pointer"
                onClick={() =>
                  navigate({
                    to: '/register/maintenance-plans/add',
                    search: (prev) => ({ ...prev, id: item.id }),
                  })
                }
              >
                <div className="flex flex-1 items-center gap-4">
                  <ItemMedia variant="image">
                    <Settings className="size-5" />
                  </ItemMedia>
                  <ItemContent className="gap-0">
                    <ItemTitle className="text-base">{item.description}</ItemTitle>
                    <ItemDescription className="flex items-center gap-2">
                      <Building2 className="size-3" /> {item.enterprise?.name}
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
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate({
                              to: '/register/maintenance-plans/add',
                              search: (prev) => ({ ...prev, id: item.id }),
                            });
                          }}
                        >
                          <Edit2 className="mr-2 size-4" />
                          {t('edit')}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIdToDelete(item.id);
                          }}
                        >
                          <Trash2 className="mr-2 size-4" />
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

      <AlertDialog open={!!idToDelete} onOpenChange={(open) => !open && setIdToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('confirm.delete')}</AlertDialogTitle>
            <AlertDialogDescription>{t('confirm.delete.description')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {totalCount > 0 && (
        <CardFooter layout="multi">
          <div className="order-2 flex items-center gap-2 text-muted-foreground text-sm sm:order-1">
            <span>{t('show')}</span>
            <Select
              value={String(size)}
              onValueChange={(val) =>
                navigate({
                  search: (prev: MaintenancePlansSearch) => ({
                    ...prev,
                    size: Number(val),
                    page: 1,
                  }),
                })
              }
            >
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
                      if (page > 1) navigate({ search: (prev: MaintenancePlansSearch) => ({ ...prev, page: page - 1 }) });
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
                          navigate({ search: (prev: MaintenancePlansSearch) => ({ ...prev, page: pageNum }) });
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
                      if (page < totalPages) navigate({ search: (prev: MaintenancePlansSearch) => ({ ...prev, page: page + 1 }) });
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
