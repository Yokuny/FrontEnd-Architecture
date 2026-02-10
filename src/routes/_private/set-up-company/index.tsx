import { createFileRoute, Link } from '@tanstack/react-router';
import { Building2, Mail, MapPin, MessageSquare, Network, Settings, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';

export const Route = createFileRoute('/_private/set-up-company/')({
  component: SetupCompanyHubPage,
  beforeLoad: () => ({
    title: 'setup.company',
  }),
  staticData: {
    title: 'setup.company',
    description: 'Central de configuração empresarial do sistema. Acesse todas as configurações de integração, email, APIs externas, chatbot, limites e frota em um único lugar.',
    tags: ['setup', 'configuração', 'config', 'admin', 'hub', 'central', 'empresa', 'company', 'integration', 'integração', 'settings'],
    examplePrompts: [
      'Como configurar minha empresa no sistema?',
      'Onde encontro as configurações de integração?',
      'Como fazer o setup inicial da empresa?',
      'Quais configurações estão disponíveis para administradores?',
    ],
    searchParams: [],
    relatedRoutes: [
      { path: '/_private/set-up-company/integration-list', relation: 'child', description: 'Lista de integrações AIS' },
      { path: '/_private/set-up-company/setup-email', relation: 'child', description: 'Configuração de email SMTP' },
      { path: '/_private/set-up-company/setup-api-external', relation: 'child', description: 'Configuração de APIs externas' },
      { path: '/_private/set-up-company/setup-chatbot', relation: 'child', description: 'Configuração de chatbot WhatsApp' },
      { path: '/_private/set-up-company/external-users', relation: 'child', description: 'Usuários externos para integração' },
      { path: '/_private/set-up-company/setup-limits', relation: 'child', description: 'Limites e quotas do sistema' },
      { path: '/_private/set-up-company/setup-fleet', relation: 'child', description: 'Configuração da frota' },
    ],
    entities: ['Enterprise', 'Integration', 'Config'],
    capabilities: ['Acessar hub de configurações', 'Navegar entre módulos de setup', 'Visualizar todas as opções de configuração empresarial', 'Gerenciar integrações e APIs'],
  },
});

function SetupCompanyHubPage() {
  const { t } = useTranslation();

  const menuItems = [
    {
      title: t('integration'),
      description: t('integration.description'),
      icon: Building2,
      to: '/set-up-company/integration-list' as const,
    },
    {
      title: t('setup.email'),
      description: t('setup.email.description'),
      icon: Mail,
      to: '/set-up-company/setup-email' as const,
    },
    {
      title: t('setup.api.external'),
      description: t('setup.api.external.description'),
      icon: Network,
      to: '/set-up-company/setup-api-external' as const,
    },
    {
      title: t('setup.chatbot'),
      description: t('setup.chatbot.description'),
      icon: MessageSquare,
      to: '/set-up-company/setup-chatbot' as const,
    },
    {
      title: t('usernames.external'),
      description: t('usernames.external.description'),
      icon: Users,
      to: '/set-up-company/external-users' as const,
    },
    {
      title: t('setup.limits'),
      description: t('setup.limits.description'),
      icon: Settings,
      to: '/set-up-company/setup-limits' as const,
    },
    {
      title: `${t('config')} Fleet`,
      description: t('setup.fleet.description'),
      icon: MapPin,
      to: '/set-up-company/setup-fleet' as const,
    },
  ];

  return (
    <Card>
      <CardHeader />
      <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {menuItems.map((item) => (
          <Item key={item.to} variant="outline" className="h-full cursor-pointer bg-card transition-colors hover:bg-muted/50" asChild>
            <Link to={item.to}>
              <ItemMedia variant="icon">
                <item.icon className="size-5" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle className="text-base">{item.title}</ItemTitle>
                <ItemDescription>{item.description}</ItemDescription>
              </ItemContent>
            </Link>
          </Item>
        ))}
      </CardContent>
    </Card>
  );
}
