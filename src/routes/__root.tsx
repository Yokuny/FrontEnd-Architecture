import { TanStackDevtools } from '@tanstack/react-devtools';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import Notification from '@/components/icons/Notification.Icon';
import { ThemeSwitcher } from '@/components/sidebar/switch-theme';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';

export const Route = createRootRoute({
  notFoundComponent: () => {
    return (
      <Card className="m-2">
        <CardHeader title={'Pagina não encontrada'}>
          <ThemeSwitcher />
        </CardHeader>
        <CardContent>
          <DefaultEmptyData />
        </CardContent>
      </Card>
    );
  },
  errorComponent: ({ error }) => {
    return (
      <Card className="m-2">
        <CardHeader title={'error.page'}>
          <ThemeSwitcher />
        </CardHeader>
        <CardContent>
          <Empty className="border-2 border-destructive/20 bg-destructive/10">
            <EmptyHeader>
              <Notification className="size-8 animate-pulse text-destructive" />
              <EmptyTitle className="text-destructive">{'error.page'}</EmptyTitle>
              <EmptyDescription className="max-w-md break-all rounded-md border bg-background/50 p-4 font-mono text-xs">
                {error instanceof Error ? error.message : String(error)}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    );
  },
  pendingComponent: () => {
    return (
      <Card className="m-2">
        <CardHeader title={'error.page'}>
          <ThemeSwitcher />
        </CardHeader>
        <CardContent>
          <DefaultLoading />
        </CardContent>
      </Card>
    );
  },
  component: () => (
    <>
      <Outlet />
      {import.meta.env.DEV && (
        <TanStackDevtools
          config={{
            position: 'middle-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
      )}
    </>
  ),
});
