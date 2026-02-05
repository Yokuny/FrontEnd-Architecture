import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { MoreVertical, Pencil, Plus, Search, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import EmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Item, ItemContent, ItemGroup, ItemMedia, ItemTitle } from '@/components/ui/item';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { type Group, useGroupsByEnterprise } from '@/hooks/use-groups-api';

// import { useHasPermission } from '@/hooks/use-permissions';

const groupsSearchSchema = z.object({
  search: z.string().optional(),
});

export const Route = createFileRoute('/_private/operation/groups/')({
  staticData: {
    title: 'groups',
    description:
      'Gerenciamento de grupos de máquinas e ativos operacionais. Permite organizar a frota em grupos lógicos para facilitar análise de performance, downtime e disponibilidade. Suporta busca por nome, criação e edição de grupos por empresa.',
    tags: ['groups', 'grupos', 'machines', 'máquinas', 'fleet', 'frota', 'organization', 'organização', 'operational', 'operacional', 'assets', 'ativos'],
    examplePrompts: ['Gerenciar grupos de máquinas', 'Criar novo grupo operacional', 'Editar grupo de ativos', 'Organizar frota em grupos', 'Buscar grupo por nome'],
    searchParams: [{ name: 'search', type: 'string', description: 'Busca por nome do grupo', example: 'Grupo Alpha' }],
    relatedRoutes: [
      { path: '/_private/operation', relation: 'parent', description: 'Hub operacional' },
      { path: '/_private/operation/groups/add', relation: 'child', description: 'Adicionar/editar grupo' },
      { path: '/_private/operation/operational-fleet', relation: 'sibling', description: 'Dashboard da frota' },
    ],
    entities: ['Group', 'Machine', 'Enterprise'],
    capabilities: ['Listar grupos de máquinas', 'Criar novo grupo', 'Editar grupo existente', 'Buscar grupo por nome', 'Filtrar por empresa', 'Organizar ativos operacionais'],
  },
  component: GroupsListPage,
  validateSearch: (search: Record<string, unknown>) => groupsSearchSchema.parse(search),
});

function GroupsListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate({ from: Route.fullPath });
  const { search } = useSearch({ from: '/_private/operation/groups/' });
  const { idEnterprise } = useEnterpriseFilter();

  // const hasPermissionAdd = useHasPermission('/group-add');

  const { data, isLoading } = useGroupsByEnterprise(idEnterprise || '');

  const allGroups = data?.data || [];

  // Local filtering
  const filteredGroups = allGroups.filter((group) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return group.name.toLowerCase().includes(s);
  });

  const handleNewGroup = () => {
    navigate({ to: '/operation/groups/add' });
  };

  const handleEditGroup = (id: string) => {
    navigate({ to: '/operation/groups/add', search: { id } });
  };

  const renderGroupItem = (item: Group) => {
    const id = item.id || item._id || '';

    return (
      <Item key={id} variant="outline" className="cursor-pointer" onClick={() => handleEditGroup(id)}>
        <div className="flex flex-1 items-center gap-4">
          <ItemMedia variant="image">
            <Users className="size-5 text-primary" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle className="text-base">{item.name}</ItemTitle>
          </ItemContent>
        </div>

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
                  handleEditGroup(id);
                }}
              >
                <Pencil className="mr-2 size-4" />
                {t('edit')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Item>
    );
  };

  return (
    <Card>
      <CardHeader title={t('groups')}>
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
                    search: (prev) => ({ ...prev, search: e.target.value || undefined }),
                  });
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate({
                    search: (prev) => ({ ...prev, search: e.currentTarget.value || undefined }),
                  });
                }
              }}
            />
          </div>
          {/* {hasPermissionAdd && ( */}
          <Button onClick={handleNewGroup} disabled={!idEnterprise}>
            <Plus className="mr-2 size-4" />
            {t('new')}
          </Button>
          {/* )} */}
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <DefaultLoading />
        ) : filteredGroups.length === 0 ? (
          <EmptyData />
        ) : (
          <div className="grid gap-2">
            <ItemGroup>{filteredGroups.map((group) => renderGroupItem(group))}</ItemGroup>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
