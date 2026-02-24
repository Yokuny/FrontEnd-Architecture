import { createFileRoute } from '@tanstack/react-router';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DependentsTab } from './@components/dependents-tab';
import { EditProfileTab } from './@components/edit-profile-tab';
import { VisitorsTab } from './@components/visitors-tab';

export const Route = createFileRoute('/_private/access-user/')({
  component: AccessUserPage,
  staticData: { title: 'Meus Dados' },
});

function AccessUserPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Meus Dados</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="edit">
          <TabsList>
            <TabsTrigger value="edit">Editar Dados</TabsTrigger>
            <TabsTrigger value="dependents">Dependentes</TabsTrigger>
            <TabsTrigger value="visitors">Visitantes</TabsTrigger>
          </TabsList>
          <TabsContent value="edit">
            <EditProfileTab />
          </TabsContent>
          <TabsContent value="dependents">
            <DependentsTab />
          </TabsContent>
          <TabsContent value="visitors">
            <VisitorsTab />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
