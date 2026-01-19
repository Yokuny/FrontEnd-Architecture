import { createFileRoute, Link } from '@tanstack/react-router';
import { BarChart2, Clock, FileText, Gauge, GitCompare, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';

export const Route = createFileRoute('/_private/consumo/')({
  component: ConsumoHubPage,
});

function ConsumoHubPage() {
  const { t } = useTranslation();

  const menuItems = [
    {
      title: t('consumption.daily'),
      description: t('consumption.daily.description', { defaultValue: 'Monitoramento de consumo diário de combustível.' }),
      icon: BarChart2,
      to: '/consumo/daily' as const,
    },
    {
      title: t('consumption.interval'),
      description: t('consumption.interval.description', { defaultValue: 'Análise de consumo em intervalos de tempo personalizados.' }),
      icon: Gauge,
      to: '/consumo/interval' as const,
    },
    {
      title: t('consumption.time.operation'),
      description: t('consumption.time.operation.description', { defaultValue: 'Consumo por modo de operação e tempo de atividade.' }),
      icon: Clock,
      to: '/consumo/time-operation' as const,
    },
    {
      title: t('consumption.comparative'),
      description: t('consumption.comparative.description', { defaultValue: 'Comparação de consumo entre diferentes embarcações.' }),
      icon: GitCompare,
      to: '/consumo/comparative' as const,
    },
    {
      title: t('consumption.rve.rdo'),
      description: t('consumption.rve.rdo.description', { defaultValue: 'Dashboard comparativo entre RDO e RVE.' }),
      icon: FileText,
      to: '/consumo/rve-rdo' as const,
    },
    {
      title: t('consumption.rve.sounding'),
      description: t('consumption.rve.sounding.description', { defaultValue: 'Dashboard comparativo entre sondagem e RVE.' }),
      icon: TrendingUp,
      to: '/consumo/rve-sounding' as const,
    },
  ];

  return (
    <Card>
      <CardHeader title={t('consumption')} />
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
