import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Droplet, MoreVertical, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import EmptyStandard from '@/components/default-empty-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { useEnterpriseFilter } from '@/hooks/use-enterprises-api';
import { useFuelTypes, useFuelTypesApi } from '@/hooks/use-fuel-types-api';

export const Route = createFileRoute('/_private/register/type-fuel/')({
  component: FuelTypeListPage,
  beforeLoad: () => ({
    title: 'types.fuel',
  }),
});

function FuelTypeListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { idEnterprise } = useEnterpriseFilter();

  const { data: fuelTypes, isLoading } = useFuelTypes(idEnterprise);
  const { deleteFuelType } = useFuelTypesApi();

  const handleDelete = async (id: string) => {
    try {
      await deleteFuelType.mutateAsync(id);
      toast.success(t('delete.successfull'));
    } catch {
      toast.error(t('error.delete'));
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader title={t('types.fuel')} />
        <CardContent className="p-12">
          <Skeleton className="h-48 w-full flex items-center justify-center">
            <Spinner />
          </Skeleton>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader title={t('types.fuel')}>
        <Button onClick={() => navigate({ to: '/register/type-fuel/add' })}>
          <Plus className="size-4 mr-2" />
          {t('add')}
        </Button>
      </CardHeader>

      <CardContent>
        {!fuelTypes?.length ? (
          <EmptyStandard />
        ) : (
          <div className="grid gap-2">
            {fuelTypes.map((item) => (
              <Item key={item.id} variant="outline" className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <ItemMedia className="size-10 rounded-full flex items-center justify-center border" style={{ borderColor: item.color }}>
                    <Droplet className="size-5" style={{ color: item.color }} />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{item.description}</ItemTitle>
                    <ItemDescription>{item.enterprise?.name}</ItemDescription>
                  </ItemContent>
                </div>

                <div className="flex items-center gap-2">
                  <ItemTitle className="tabular-nums text-lg">{item.code}</ItemTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          navigate({
                            to: '/register/type-fuel/add',
                            search: { id: item.id },
                          })
                        }
                      >
                        {t('edit')}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(item.id)}>
                        {t('delete')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </Item>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter>{/* Pagination space */}</CardFooter>
    </Card>
  );
}
