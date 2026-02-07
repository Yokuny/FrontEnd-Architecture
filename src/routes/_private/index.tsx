import { createFileRoute, Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import DefaultEmptyData from '@/components/default-empty-data';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import { buildSidebarRoutes } from '@/config/sidebarRoutes';

export const Route = createFileRoute('/_private/')({
  component: PrivateHubPage,
  staticData: {
    title: 'index',
    description:
      'Dashboard principal do sistema - hub central com visão consolidada e acesso a todos os módulos disponíveis. Apresenta cards navegáveis para CMMS, Voyage, Service Management, Fleet Manager, IA, Configurações e demais funcionalidades baseadas nas permissões do usuário',
    tags: ['dashboard', 'home', 'hub', 'main', 'principal', 'index', 'menu', 'modules', 'módulos', 'navigation', 'overview', 'landing'],
    examplePrompts: ['Ir para dashboard principal', 'Ver todos os módulos disponíveis', 'Acessar menu principal', 'Navegar pelos módulos do sistema', 'Ver visão geral do sistema'],
    searchParams: [],
    relatedRoutes: [
      { path: '/_private/cmms', relation: 'child', description: 'CMMS - Gestão de manutenção' },
      { path: '/_private/voyage', relation: 'child', description: 'Gestão de viagens' },
      { path: '/_private/service-management', relation: 'child', description: 'Gestão de serviços' },
      { path: '/_private/fleet-manager', relation: 'child', description: 'Gestão de frota' },
      { path: '/_private/ia', relation: 'child', description: 'Inteligência Artificial' },
      { path: '/_private/set-up-company', relation: 'child', description: 'Configurações da empresa' },
      { path: '/_private/calendar-maintenance', relation: 'child', description: 'Calendário de manutenções' },
      { path: '/_private/form', relation: 'child', description: 'Formulários dinâmicos' },
    ],
    entities: ['SidebarRoute', 'Module', 'User', 'Permission'],
    capabilities: [
      'Visualizar módulos disponíveis',
      'Navegar para módulos',
      'Ver descrições de módulos',
      'Acessar funcionalidades baseadas em permissões',
      'Visualizar menu principal',
    ],
  },
});

function PrivateHubPage() {
  const { t } = useTranslation();
  const routes = buildSidebarRoutes();

  if (routes.length === 0) {
    return (
      <Card>
        <CardHeader />
        <CardContent>
          <DefaultEmptyData />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader />
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
