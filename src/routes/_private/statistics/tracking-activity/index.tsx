import { createFileRoute } from '@tanstack/react-router';
import { Users } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { Item, ItemGroup } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { useUserSamePermissionSelect } from '@/hooks/use-user-same-permission-api';
import { AccessDayChart } from './@components/AccessDayChart';
import { ActionsFleetChart } from './@components/ActionsFleetChart';
import { DevicesChart } from './@components/DevicesChart';
import { LocationsChart } from './@components/LocationsChart';
import { TrackingPathsChart } from './@components/TrackingPathsChart';
import { UserAccessDayChart } from './@components/UserAccessDayChart';
import { UserRMDayChart } from './@components/UserRMDayChart';
import { UsersChart } from './@components/UsersChart';
import { UsersRMChart } from './@components/UsersRMChart';
import { UsersWhatsappChart } from './@components/UsersWhatsappChart';
import { DEFAULT_PERIOD_FILTER, PERIOD_OPTIONS, RM_ENTERPRISE_ID } from './@consts';
import type { TrackingFilters } from './@interface';

const searchSchema = z.object({
  idEnterprise: z.string().optional(),
  periodFilter: z.number().optional(),
  'idUsers[]': z.array(z.string()).optional(),
  'idUsersNotIncluded[]': z.array(z.string()).optional(),
});

export const Route = createFileRoute('/_private/statistics/tracking-activity/')({
  component: TrackingActivityPage,
  validateSearch: (search) => searchSchema.parse(search),
  staticData: {
    title: 'statistics.tracking-activity',
    description:
      'Rastreamento de atividades dos usuários no sistema. Exibe gráficos de acessos diários, ações realizadas, dispositivos utilizados, localizações, paths navegados e estatísticas de uso do WhatsApp. Permite filtros por usuário e período.',
    tags: ['tracking', 'activity', 'user-analytics', 'access-log', 'audit', 'usage-statistics', 'whatsapp', 'devices', 'monitoring'],
    examplePrompts: ['Ver atividades dos usuários no sistema', 'Analisar acessos e dispositivos utilizados', 'Consultar estatísticas de uso por usuário'],
    searchParams: [
      { name: 'idEnterprise', type: 'string', description: 'ID da empresa para filtrar atividades' },
      { name: 'periodFilter', type: 'number', description: 'Período em horas (padrão: últimas horas)' },
      { name: 'idUsers[]', type: 'array', description: 'IDs dos usuários incluídos no filtro' },
      { name: 'idUsersNotIncluded[]', type: 'array', description: 'IDs dos usuários excluídos do filtro' },
    ],
    relatedRoutes: [
      { path: '/_private/statistics', relation: 'parent', description: 'Hub de estatísticas' },
      { path: '/_private/register/users', relation: 'alternative', description: 'Cadastro de usuários' },
    ],
    entities: ['User', 'AccessLog', 'Activity'],
    capabilities: [
      'Gráfico de acessos por dia',
      'Gráfico de acessos por usuário e dia',
      'Top usuários mais ativos',
      'Estatísticas de uso do WhatsApp',
      'Paths/rotas mais navegados',
      'Ações realizadas na frota',
      'Localizações de acesso',
      'Dispositivos utilizados',
      'Filtros por usuário (inclusão/exclusão)',
      'Filtro de período (horas)',
      'Gráficos específicos para empresa RM',
    ],
  },
});

function TrackingActivityPage() {
  const { t } = useTranslation();
  const { idEnterprise } = useEnterpriseFilter();

  const [periodFilter, setPeriodFilter] = useState(DEFAULT_PERIOD_FILTER);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [notIncludedUsers, setNotIncludedUsers] = useState<string[]>([]);

  const usersQuery = useUserSamePermissionSelect();

  const appliedFilters: TrackingFilters = {
    lastPeriodHours: periodFilter,
    idEnterprise,
    'idUsers[]': selectedUsers.length > 0 ? selectedUsers : undefined,
    'idUsersNotIncluded[]': notIncludedUsers.length > 0 ? notIncludedUsers : undefined,
  };

  return (
    <Card>
      <CardHeader title={t('tracking.activity')} />
      <CardContent className="flex flex-col gap-6">
        <Item variant="outline" className="bg-secondary">
          <div className="flex min-w-72 flex-col gap-1.5">
            <Label className="flex items-center gap-2">
              <Users className="size-4" />
              {t('users.included')}
            </Label>
            <DataMultiSelect
              placeholder={t('users.included')}
              query={usersQuery}
              value={selectedUsers}
              onChange={(vals) => setSelectedUsers(vals as string[])}
              mapToOptions={(items: any[]) =>
                items.map((user: any) => ({
                  value: user.id,
                  label: user.name,
                }))
              }
            />
          </div>

          <div className="flex min-w-72 flex-col gap-1.5">
            <Label className="flex items-center gap-2">
              <Users className="size-4" />
              {t('users.not.included')}
            </Label>
            <DataMultiSelect
              placeholder={t('users.not.included')}
              query={usersQuery}
              value={notIncludedUsers}
              onChange={(vals) => setNotIncludedUsers(vals as string[])}
              mapToOptions={(items: any[]) =>
                items.map((user: any) => ({
                  value: user.id,
                  label: user.name,
                }))
              }
            />
          </div>

          <div className="flex min-w-36 flex-col gap-1.5">
            <Label>{t('last')}</Label>
            <Select value={String(periodFilter)} onValueChange={(val) => setPeriodFilter(Number(val))}>
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PERIOD_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={String(opt.value)}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Item>

        <ItemGroup className="gap-4">
          <AccessDayChart filters={appliedFilters} />

          <UserAccessDayChart filters={appliedFilters} />

          <div className="flex w-full gap-4">
            <div className="flex-1">
              <UsersChart filters={appliedFilters} />
            </div>
            <div className="flex-1">
              <UsersWhatsappChart filters={appliedFilters} />
            </div>
          </div>

          <div className="flex w-full gap-4">
            <div className="flex-1">
              <TrackingPathsChart filters={appliedFilters} />
            </div>
            <div className="flex-1">
              <ActionsFleetChart filters={appliedFilters} />
            </div>
          </div>

          <div className="flex w-full gap-4">
            <div className="flex-1">
              <LocationsChart filters={appliedFilters} />
            </div>
            <div className="flex-1">
              <DevicesChart filters={appliedFilters} />
            </div>
          </div>

          {idEnterprise === RM_ENTERPRISE_ID && (
            <>
              <UserRMDayChart filters={appliedFilters} />
              <UsersRMChart filters={appliedFilters} />
            </>
          )}
        </ItemGroup>
      </CardContent>
    </Card>
  );
}
