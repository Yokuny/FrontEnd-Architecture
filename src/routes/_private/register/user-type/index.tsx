import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { MoreVertical, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import EmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import { useEnterpriseFilter } from '@/hooks/use-enterprises-api';
import { useUserTypes, useUserTypesApi } from '@/hooks/use-user-types-api';

export const Route = createFileRoute('/_private/register/user-type/')({
  component: UserTypeListPage,
  beforeLoad: () => ({
    title: 'types.user',
  }),
});

function UserTypeListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { idEnterprise } = useEnterpriseFilter();

  const { data: userTypes, isLoading } = useUserTypes(idEnterprise);
  const { deleteUserType } = useUserTypesApi();

  const handleDelete = async (id: string) => {
    try {
      await deleteUserType.mutateAsync(id);
      toast.success(t('delete.successfull'));
    } catch {
      toast.error(t('error.delete'));
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader title={t('types.user')} />
        <CardContent className="p-12">
          <DefaultLoading />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader title={t('types.user')}>
        <Button onClick={() => navigate({ to: '/register/user-type/add' })}>
          <Plus className="size-4 mr-2" />
          {t('add')}
        </Button>
      </CardHeader>

      <CardContent>
        {!userTypes?.length ? (
          <EmptyData />
        ) : (
          <div className="grid gap-2">
            {userTypes.map((item) => (
              <Item key={item.id} variant="outline" className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <ItemMedia className="size-4 rounded-full" style={{ backgroundColor: item.color }} />
                  <ItemContent>
                    <ItemTitle>{item.description}</ItemTitle>
                    {item.enterprise && <ItemDescription>{item.enterprise.name}</ItemDescription>}
                  </ItemContent>
                </div>

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
                          to: '/register/user-type/add',
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
              </Item>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter>{/* Pagination could go here if implemented in the API/Hook */}</CardFooter>
    </Card>
  );
}
