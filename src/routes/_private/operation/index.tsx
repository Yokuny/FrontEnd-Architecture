import { createFileRoute, Link } from '@tanstack/react-router';
import { Activity, Clock, DollarSign, LayoutDashboard, Target, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';

export const Route = createFileRoute('/_private/operation/')({
  component: OperationHubPage,
});

function OperationHubPage() {
  const { t } = useTranslation();

  const menuItems = [
    {
      title: t('downtime'),
      description: t('operation.downtime.description', { defaultValue: 'Gerenciamento de paradas e tempos de inatividade.' }),
      icon: Clock,
      to: '/operation/downtime' as const,
    },
    {
      title: t('operational.asset'),
      description: t('operation.operational.asset.description', { defaultValue: 'Análise de índices desempenho operacional dos ativos.' }),
      icon: Activity,
      to: '/operation/operational-asset' as const,
    },
    {
      title: t('operational.fleet'),
      description: t('operation.operational.fleet.description', { defaultValue: 'Dashboard operacional com indicadores em tempo real.' }),
      icon: LayoutDashboard,
      to: '/operation/operational-fleet' as const,
    },
    {
      title: t('groups'),
      description: t('operation.groups.description', { defaultValue: 'Gerenciamento de grupos operacionais.' }),
      icon: Users,
      to: '/operation/groups' as const,
    },
    {
      title: t('goals'),
      description: t('operation.goals.description', { defaultValue: 'Definição e acompanhamento de metas operacionais.' }),
      icon: Target,
      to: '/operation/goals' as const,
    },
    {
      title: t('ptax'),
      description: t('operation.ptax.description', { defaultValue: 'Gerenciamento de taxas PTAX.' }),
      icon: DollarSign,
      to: '/operation/ptax' as const,
    },
  ];

  return (
    <Card>
      <CardHeader title={t('operation')} />
      <CardContent className="grid gap-4 md:grid-cols-2">
        {menuItems.map((item) => (
          <Item key={item.to} variant="outline" className="cursor-pointer h-full" asChild>
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
