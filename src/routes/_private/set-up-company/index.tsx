import { createFileRoute, Link } from '@tanstack/react-router';
import { Building2, Mail, Network } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';

export const Route = createFileRoute('/_private/set-up-company/')({
  component: SetupCompanyHubPage,
});

function SetupCompanyHubPage() {
  const { t } = useTranslation();

  const menuItems = [
    {
      title: t('integration'),
      description: t('integration.description', { defaultValue: 'Visualize e gerencie a lista de integrações disponíveis.' }),
      icon: Building2,
      to: '/set-up-company/integration-list' as const,
    },
    {
      title: t('setup.email'),
      description: t('setup.email.description', { defaultValue: 'Configure os parâmetros de envio de e-mail da empresa.' }),
      icon: Mail,
      to: '/set-up-company/setup-email' as const,
    },
    {
      title: t('setup.api.external'),
      description: t('setup.api.external.description', { defaultValue: 'Configure as credenciais e acessos de APIs externas.' }),
      icon: Network,
      to: '/set-up-company/setup-api-external' as const,
    },
  ];

  return (
    <Card>
      <CardHeader title={t('setup.company')} />
      <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {menuItems.map((item) => (
          <Item key={item.to} variant="outline" className="bg-card hover:bg-muted/50 transition-colors cursor-pointer h-full" asChild>
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
