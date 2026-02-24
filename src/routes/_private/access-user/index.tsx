import { createFileRoute } from '@tanstack/react-router';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DependentsTab } from './@components/dependents-tab';
import { EditProfileTab } from './@components/edit-profile-tab';
import { VisitorsTab } from './@components/visitors-tab';

export const Route = createFileRoute('/_private/access-user/')({
  component: AccessUserPage,
  staticData: { title: 'accessUser.title' },
});

function AccessUserPage() {
  return (
    <Card>
      <CardHeader title={'accessUser.title'} />
      <CardContent>
        <Tabs defaultValue="edit">
          <TabsList>
            <TabsTrigger value="edit">{'accessUser.tab.edit'}</TabsTrigger>
            <TabsTrigger value="dependents">{'accessUser.tab.dependents'}</TabsTrigger>
            <TabsTrigger value="visitors">{'accessUser.tab.visitors'}</TabsTrigger>
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
