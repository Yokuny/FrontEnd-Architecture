import { createFileRoute, Link } from '@tanstack/react-router';
import { Activity, Bell, Building2, Cpu, Droplet, FileText, Flag, Radio, Settings, Sheet, Ship, Sliders, User, Users, Workflow, Wrench } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';

export const Route = createFileRoute('/_private/register/')({
  component: RegisterHubPage,
  beforeLoad: () => ({
    title: 'register',
  }),
});

function RegisterHubPage() {
  const { t } = useTranslation();

  const menuItems = [
    {
      title: t('enterprises'),
      description: t('enterprises.description', 'Gerencie as empresas e organizações do sistema.'),
      icon: Building2,
      to: '/register/enterprises' as const,
    },
    {
      title: t('customers'),
      description: t('customers.description', 'Gerencie os clientes e seus dados de contato.'),
      icon: User,
      to: '/register/customers' as const,
    },
    {
      title: t('contracts'),
      description: t('contracts.description', 'Gerencie os contratos e acordos de serviço.'),
      icon: FileText,
      to: '/register/contracts' as const,
    },
    {
      title: t('types.user'),
      description: t('types.user.description', 'Gerencie as permissões e tipos de usuários.'),
      icon: Users,
      to: '/register/user-type' as const,
    },
    {
      title: t('machines'),
      description: t('machines.description', 'Gerencie os ativos e equipamentos da frota.'),
      icon: Cpu,
      to: '/register/machines' as const,
    },
    {
      title: t('models.machine'),
      description: t('models.machine.description', 'Gerencie os modelos de ativos e suas especificações.'),
      icon: Settings,
      to: '/register/model-machine' as const,
    },
    {
      title: t('sensors'),
      description: t('sensors.description', 'Gerencie a lista de sensores e suas configurações de sinal.'),
      icon: Activity,
      to: '/register/sensors' as const,
    },
    {
      title: t('sensor-functions'),
      description: t('sensor-functions.description', 'Defina as funções e lógicas de processamento dos sensores.'),
      icon: Workflow,
      to: '/register/sensor-functions' as const,
    },
    {
      title: t('platforms'),
      description: t('platforms.description', 'Gerencie as plataformas e suas localizações.'),
      icon: Ship,
      to: '/register/platform' as const,
    },
    {
      title: t('buoys'),
      description: t('buoys.description', 'Gerencie as boias e sua localização.'),
      icon: Radio,
      to: '/register/buoy' as const,
    },
    {
      title: t('geofences'),
      description: t('geofences.description', 'Gerencie as cercas virtuais e áreas de segurança.'),
      icon: Flag,
      to: '/register/geofences' as const,
    },
    {
      title: t('alerts'),
      description: t('alerts.description', 'Gerencie as regras e notificações de alerta do sistema.'),
      icon: Bell,
      to: '/register/alerts' as const,
    },
    {
      title: t('maintenance.plans'),
      description: t('maintenance.plans.description', 'Configure e acompanhe os planos de manutenção preventiva.'),
      icon: Settings,
      to: '/register/maintenance-plans' as const,
    },
    {
      title: t('parts'),
      description: t('parts.description', 'Gerencie o catálogo de peças e materiais.'),
      icon: Wrench,
      to: '/register/parts' as const,
    },
    {
      title: t('types.fuel'),
      description: t('types.fuel.description', 'Gerencie os tipos de combustível utilizados.'),
      icon: Droplet,
      to: '/register/type-fuel' as const,
    },
    {
      title: t('config.form'),
      description: t('forms.description', 'Configure os formulários e checklists do sistema.'),
      icon: Sheet,
      to: '/register/forms' as const,
    },
    {
      title: t('params'),
      description: t('params.description', 'Configure os parâmetros globais do sistema.'),
      icon: Sliders,
      to: '/register/params' as const,
    },
  ];

  return (
    <Card>
      <CardHeader title={t('register')} />
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
