import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Building2, Edit, Plus } from 'lucide-react';
import { FormattedMessage } from 'react-intl';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api/client';

export const Route = createFileRoute('/_private/permissions/users/enterprises/$id')({
  component: ListUserEnterprisesPage,
});

interface UserEnterprisePermission {
  id: string;
  enterprise: {
    id: string;
    name: string;
    image?: { url: string };
  };
  role?: { id: string; description: string }[];
}

function useUserEnterprises(userId: string) {
  return useQuery({
    queryKey: ['user-enterprises', userId],
    queryFn: async () => {
      const idEnterpriseFilter = localStorage.getItem('id_enterprise_filter');
      let url = `/user/enterprises?id=${userId}`;
      if (idEnterpriseFilter) {
        url += `&idEnterprise=${idEnterpriseFilter}`;
      }
      const response = await api.get<UserEnterprisePermission[]>(url);
      return response.data;
    },
    enabled: !!userId,
  });
}

function ListUserEnterprisesPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data: enterprises, isLoading } = useUserEnterprises(id);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              <FormattedMessage id="permission.enterprises" defaultMessage="Permissões por Empresa" />
            </CardTitle>
            <Button size="sm" onClick={() => navigate({ to: '/permissions/users/permissions/add', search: { idRef: id } })}>
              <Plus className="mr-2 h-4 w-4" />
              <FormattedMessage id="new.permission" defaultMessage="Nova Permissão" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={`skeleton-${i}`} className="h-16 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : enterprises && enterprises.length > 0 ? (
            <div className="space-y-3">
              {enterprises.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  style={{ borderLeft: '4px solid #115C93' }}
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{item.enterprise?.name}</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.role?.map((r) => (
                        <Badge key={r.id} variant="secondary" className="text-xs">
                          {r.description}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => navigate({ to: '/permissions/users/permissions/add', search: { id: item.id } })}>
                    <Edit className="mr-2 h-3 w-3" />
                    <FormattedMessage id="edit" defaultMessage="Editar" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FormattedMessage id="no.permissions.found" defaultMessage="Nenhuma permissão encontrada." />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
