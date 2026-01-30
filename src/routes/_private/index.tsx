import { createFileRoute, Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import DefaultEmptyData from '@/components/default-empty-data';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import { buildSidebarRoutes } from '@/config/sidebarRoutes';

export const Route = createFileRoute('/_private/')({
  component: PrivateHubPage,
});

function PrivateHubPage() {
  const { t } = useTranslation();
  const routes = buildSidebarRoutes();

  if (routes.length === 0) {
    return (
      <Card>
        <CardHeader title={t('index')} />
        <CardContent>
          <DefaultEmptyData />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader title={t('index')} />
      <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {routes.map((route) => {
          const label = t(route.labelKey);
          const descriptionKey = `${route.labelKey}.description`;
          const description = t(descriptionKey);
          const hasDescription = description !== descriptionKey;

          return (
            <Item key={route.id} variant="outline" className="h-full cursor-pointer bg-card transition-colors hover:bg-muted/50" asChild>
              <Link to={route.path}>
                <ItemMedia variant="icon">{route.icon && <route.icon className="size-5" />}</ItemMedia>
                <ItemContent>
                  <ItemTitle className="text-base">{label}</ItemTitle>
                  <ItemDescription className="line-clamp-2">{hasDescription ? description : label}</ItemDescription>
                </ItemContent>
              </Link>
            </Item>
          );
        })}
      </CardContent>
    </Card>
  );
}
