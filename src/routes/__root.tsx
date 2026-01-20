import { TanStackDevtools } from '@tanstack/react-devtools';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { CircleAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { LanguageSwitcher } from '@/components/sidebar/switcher-language';
import { ThemeSwitcher } from '@/components/sidebar/switcher-theme';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';

export const Route = createRootRoute({
  notFoundComponent: () => {
    const { t } = useTranslation();
    return (
      <Card className="m-2">
        <CardHeader title={t('not.found.page')}>
          <div className="flex gap-2">
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>
        </CardHeader>
        <CardContent>
          <DefaultEmptyData />
        </CardContent>
      </Card>
    );
  },
  errorComponent: ({ error }) => {
    const { t } = useTranslation();
    return (
      <Card className="m-2">
        <CardHeader title={t('error.page')}>
          <div className="flex gap-2">
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>
        </CardHeader>
        <CardContent>
          <Empty className="border-2 bg-destructive/10 border-destructive/20">
            <EmptyHeader>
              <CircleAlert className="size-8 text-destructive animate-pulse" />
              <EmptyTitle className="text-destructive">{t('something.went.wrong')}</EmptyTitle>
              <EmptyDescription className="font-mono text-xs break-all max-w-md bg-background/50 p-4 rounded-md border">
                {error instanceof Error ? error.message : String(error)}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    );
  },
  pendingComponent: () => {
    const { t } = useTranslation();
    return (
      <Card className="m-2">
        <CardHeader title={t('loading.page')}>
          <div className="flex gap-2">
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>
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
      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </>
  ),
});
