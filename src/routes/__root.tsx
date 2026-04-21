import { TanStackDevtools } from '@tanstack/react-devtools';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import Notification from '@/components/icons/Notification.Icon';
import { ThemeSwitcher } from '@/components/sidebar/switch-theme';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import { t } from '@/lib/helpers/translate.helper';

export const Route = createRootRoute({
  notFoundComponent: () => {
    return (
      <Card className="m-2">
        <CardHeader title={t('page.not.found')}>
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
        <CardHeader title={t('error')}>
          <ThemeSwitcher />
        </CardHeader>
        <CardContent>
          <Empty className="border-2 border-destructive/20 bg-destructive/10">
            <EmptyHeader>
              <Notification className="size-8 animate-pulse text-destructive" />
              <EmptyTitle className="text-destructive">{t('error')}</EmptyTitle>
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
        <CardHeader title={t('error')}>
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
            customTrigger: (
              <button
                type="button"
                className="fixed right-10 bottom-10 z-9999 rounded-md border bg-background p-3 opacity-20 shadow-md transition-opacity duration-200 hover:opacity-100"
                aria-label="Toggle TanStack Devtools"
              >
                🛠️
              </button>
            ),
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
