import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { Building2, Droplet, MoreVertical, Plus, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';
import EmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from '@/components/ui/item';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { useFuelTypes, useFuelTypesApi } from '@/hooks/use-fuel-types-api';

const fuelTypesSearchSchema = z.object({
  search: z.string().optional(),
});

type FuelTypesSearch = z.infer<typeof fuelTypesSearchSchema>;

export const Route = createFileRoute('/_private/register/type-fuel/')({
  component: FuelTypeListPage,
  validateSearch: (search: Record<string, unknown>): FuelTypesSearch => fuelTypesSearchSchema.parse(search),
  beforeLoad: () => ({
    title: 'types.fuel',
  }),
});

function FuelTypeListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate({ from: Route.fullPath });
  const { search } = useSearch({ from: '/_private/register/type-fuel/' });
  const { idEnterprise } = useEnterpriseFilter();

  const { data: fuelTypes = [], isLoading } = useFuelTypes(idEnterprise);
  const { deleteFuelType } = useFuelTypesApi();

  const filteredFuelTypes = (fuelTypes || []).filter((item) => (search ? item.description.toLowerCase().includes(search.toLowerCase()) : true));

  const handleDelete = async (id: string) => {
    try {
      await deleteFuelType.mutateAsync(id);
      toast.success(t('delete.success'));
    } catch {
      toast.error(t('error.delete'));
    }
  };

  return (
    <Card>
      <CardHeader title={t('types.fuel')}>
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
                    search: (prev: FuelTypesSearch) => ({ ...prev, search: e.target.value || undefined }),
                  });
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate({
                    search: (prev: FuelTypesSearch) => ({ ...prev, search: e.currentTarget.value || undefined }),
                  });
                }
              }}
            />
          </div>
          <Button onClick={() => navigate({ to: '/register/type-fuel/add' })}>
            <Plus className="size-4 mr-2" />
            {t('add')}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <DefaultLoading />
        ) : !filteredFuelTypes.length ? (
          <EmptyData />
        ) : (
          <ItemGroup>
            {filteredFuelTypes.map((item) => (
              <Item
                key={item.id}
                variant="outline"
                className="cursor-pointer"
                onClick={() =>
                  navigate({
                    to: '/register/type-fuel/add',
                    search: { id: item.id },
                  })
                }
              >
                <div className="flex items-center gap-4 flex-1">
                  <ItemMedia variant="image">
                    <Droplet className="size-5" style={{ color: item.color }} />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle className="text-base">{item.description}</ItemTitle>
                    <ItemDescription className="flex items-center gap-2">
                      <Building2 className="size-3" /> {item.enterprise?.name}
                    </ItemDescription>
                  </ItemContent>
                </div>

                <div className="flex items-center gap-4">
                  <ItemDescription>{item.code}</ItemDescription>
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
                              to: '/register/type-fuel/add',
                              search: { id: item.id },
                            });
                          }}
                        >
                          {t('edit')}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item.id);
                          }}
                        >
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
    </Card>
  );
}
