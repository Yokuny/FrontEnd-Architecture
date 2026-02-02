import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { FileText, MoreVertical, Pencil, Plus, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import EmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from '@/components/ui/item';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { type Goal, useGoalsByEnterprise } from '@/hooks/use-goals-api';
import { useHasPermission } from '@/hooks/use-permissions';

const searchSchema = z.object({
  id: z.string().optional(),
  search: z.string().optional(),
});

export const Route = createFileRoute('/_private/operation/goals/')({
  component: GoalsListPage,
  validateSearch: (search: Record<string, unknown>) => searchSchema.parse(search),
  beforeLoad: () => ({
    title: 'goals',
  }),
});

function GoalsListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate({ from: Route.fullPath });
  const { search } = useSearch({ from: '/_private/operation/goals/' });
  const { idEnterprise } = useEnterpriseFilter();

  const hasPermissionAdd = useHasPermission('/goal-add');

  const { data, isLoading } = useGoalsByEnterprise(idEnterprise || '');

  const allGoals = data?.data || [];

  // Local filtering
  const filteredGoals = allGoals.filter((item) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return item.name.toLowerCase().includes(s) || item.type?.toLowerCase().includes(s);
  });

  const handleNewGoal = () => {
    navigate({ to: '/operation/goals/add' });
  };

  const handleEditGoal = (id: string) => {
    navigate({ to: '/operation/goals/add', search: { id } });
  };

  const renderGoalItem = (item: Goal) => {
    const canEdit = item.appliedPermissions?.canEdit ?? true;

    return (
      <Item
        key={item.id || item._id}
        variant="outline"
        className={canEdit ? 'cursor-pointer' : 'cursor-not-allowed'}
        onClick={() => {
          if (!canEdit) return;
          handleEditGoal(item.id || item._id || '');
        }}
      >
        <div className="flex flex-1 items-center gap-4">
          <ItemMedia variant="image">
            <FileText className="size-5 text-primary" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle className="text-base">{item.name}</ItemTitle>
            <div className="flex items-center gap-2">
              {item.type && <ItemDescription className="text-xs">{item.type}</ItemDescription>}
              {item.year && <ItemDescription className="text-xs">{item.year}</ItemDescription>}
            </div>
          </ItemContent>
        </div>

        <div className="flex items-center justify-end border-l pl-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button disabled={!canEdit} variant="ghost" size="icon">
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditGoal(item.id || item._id || '');
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
      <CardHeader title={t('goals')}>
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
          {hasPermissionAdd && (
            <Button onClick={handleNewGoal} disabled={!idEnterprise}>
              <Plus className="mr-2 size-4" />
              {t('new')}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <DefaultLoading />
        ) : filteredGoals.length === 0 ? (
          <EmptyData />
        ) : (
          <div className="grid gap-2">
            <ItemGroup>{filteredGoals.map((item) => renderGoalItem(item))}</ItemGroup>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
