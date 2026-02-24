import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { LogOut } from 'lucide-react';

import { ThemeSwitcher } from '@/components/sidebar/switch-theme';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ItemActions, ItemContent, ItemHeader, ItemTitle } from '@/components/ui/item';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppAuth } from '@/hooks/use-app-auth';
import { DependentsTab } from './@components/dependents-tab';
import { EditProfileTab } from './@components/edit-profile-tab';
import { VisitorsTab } from './@components/visitors-tab';

export const Route = createFileRoute('/_private/access-user/')({
  component: AccessUserPage,
  staticData: { title: 'Meus Dados' },
});

function AccessUserPage() {
  const navigate = useNavigate();
  const { clearAuth } = useAppAuth();

  function handleLogout() {
    clearAuth();
    navigate({ to: '/app-auth' });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1E3A5F] p-4">
      <div className="w-full max-w-4xl">
        <Card>
          <CardContent className="flex flex-col gap-6 p-8">
            <ItemContent className="items-center gap-4">
              <img src="/images/logo.svg" alt="Logo" className="h-16 w-auto" />
              <ItemHeader className="w-full">
                <ItemTitle className="text-2xl">Meus Dados</ItemTitle>
                <ItemActions>
                  <ThemeSwitcher />
                  <Button variant="outline" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </Button>
                </ItemActions>
              </ItemHeader>
            </ItemContent>

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
      </div>
    </div>
  );
}
