import { createFileRoute } from '@tanstack/react-router';
import { Users } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { Item, ItemContent, ItemGroup, ItemHeader, ItemTitle } from '@/components/ui/item';
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
        <div className="flex flex-wrap items-end gap-4 p-4 border rounded-lg bg-secondary/50">
          <div className="flex flex-col gap-1.5 min-w-[300px]">
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

          <div className="flex flex-col gap-1.5 min-w-[300px]">
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

          <div className="flex flex-col gap-1.5 min-w-[150px]">
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
        </div>

        <ItemGroup>
          <AccessDayChart filters={appliedFilters} />
          <UserAccessDayChart filters={appliedFilters} />

          <Item variant="outline" className="flex-col items-stretch">
            <ItemHeader>
              <ItemTitle>{t('paths')}</ItemTitle>
            </ItemHeader>
            <ItemContent>
              <TrackingPathsChart filters={appliedFilters} />
            </ItemContent>
          </Item>

          <Item variant="outline" className="flex-col items-stretch">
            <ItemHeader>
              <ItemTitle>{t('users.actions')}</ItemTitle>
            </ItemHeader>
            <UsersChart filters={appliedFilters} />
          </Item>

          <Item variant="outline" className="flex-col items-stretch">
            <ItemHeader>
              <ItemTitle>{t('locations')}</ItemTitle>
            </ItemHeader>
            <ItemContent>
              <LocationsChart filters={appliedFilters} />
            </ItemContent>
          </Item>

          <Item variant="outline" className="flex-col items-stretch">
            <ItemHeader>
              <ItemTitle>{t('actions.fleet')}</ItemTitle>
            </ItemHeader>
            <ItemContent>
              <ActionsFleetChart filters={appliedFilters} />
            </ItemContent>
          </Item>

          <Item variant="outline" className="flex-col items-stretch">
            <ItemHeader>
              <ItemTitle>{t('devices')}</ItemTitle>
            </ItemHeader>
            <ItemContent>
              <DevicesChart filters={appliedFilters} />
            </ItemContent>
          </Item>

          <Item variant="outline" className="flex-col items-stretch">
            <ItemHeader>
              <ItemTitle>{t('users.whatsapp')}</ItemTitle>
            </ItemHeader>
            <ItemContent>
              <UsersWhatsappChart filters={appliedFilters} />
            </ItemContent>
          </Item>

          {idEnterprise === RM_ENTERPRISE_ID && (
            <>
              <Item variant="outline" className="flex-col items-stretch col-span-2">
                <ItemHeader>
                  <ItemTitle>{t('user.rm.day')}</ItemTitle>
                </ItemHeader>
                <ItemContent>
                  <UserRMDayChart filters={appliedFilters} />
                </ItemContent>
              </Item>

              <Item variant="outline" className="flex-col items-stretch">
                <ItemHeader>
                  <ItemTitle>{t('users.rm')}</ItemTitle>
                </ItemHeader>
                <ItemContent>
                  <UsersRMChart filters={appliedFilters} />
                </ItemContent>
              </Item>
            </>
          )}
        </ItemGroup>
      </CardContent>
    </Card>
  );
}
