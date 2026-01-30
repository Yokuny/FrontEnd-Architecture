import { createFileRoute } from '@tanstack/react-router';
import { differenceInHours, format, isValid } from 'date-fns';
import { Anchor, MapPin, Ship } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import EmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DataTable, type DataTableColumn } from '@/components/ui/data-table';
import { ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { useFleetStatusList } from '@/hooks/use-statistics-api';
import { INTEGRATION_OPTIONS } from './@consts/integration.consts';

const searchSchema = z.object({
  idEnterprise: z.string().optional(),
});

export const Route = createFileRoute('/_private/statistics/integration/')({
  component: FleetStatusListPage,
  validateSearch: (search) => searchSchema.parse(search),
});

function FleetStatusListPage() {
  const { t } = useTranslation();
  const { idEnterprise } = useEnterpriseFilter();

  const { data, isLoading } = useFleetStatusList(idEnterprise);

  const getColorUpdate = (date?: string) => {
    if (!date) return undefined;

    const dateObj = new Date(date);
    if (!isValid(dateObj)) return undefined;

    const hours = differenceInHours(new Date(), dateObj);

    if (hours >= 14) {
      return {
        text: t('to.check'),
        className: 'bg-destructive text-white hover:bg-destructive/80',
      };
    }

    if (hours >= 8) {
      return {
        text: t('worrisome'),
        className: 'bg-destructive text-white hover:bg-destructive/80',
      };
    }

    if (hours >= 4) {
      return {
        text: t('warn'),
        className: 'bg-warning text-warning-foreground hover:bg-warning/80',
      };
    }

    return undefined;
  };

  const columns: DataTableColumn<any>[] = [
    {
      key: 'dataSheet',
      header: t('image'),
      width: '80px',
      render: (value, row) => (
        <Avatar className="size-12">
          <AvatarImage src={value?.image?.url || row.image?.url} alt={row.name} />
          <AvatarFallback>
            <Ship className="size-5" />
          </AvatarFallback>
        </Avatar>
      ),
    },
    {
      key: 'name_search',
      header: t('name'),
      render: (_, row) => (
        <ItemContent className="gap-0">
          <ItemTitle className="text-base">{row.name || '-'}</ItemTitle>
          <div className="flex gap-2">
            {row.dataSheet?.mmsi && <ItemDescription className="text-xs uppercase">MMSI: {row.dataSheet.mmsi}</ItemDescription>}
            {row.dataSheet?.imo && <ItemDescription className="text-xs uppercase">IMO: {row.dataSheet.imo}</ItemDescription>}
          </div>
          {row.createAt && (
            <ItemDescription className="text-xs">
              {t('create.at')}: {format(new Date(row.createAt), 'dd-MM-yyyy HH:mm')}
            </ItemDescription>
          )}
        </ItemContent>
      ),
      sortable: true,
    },
    {
      key: 'date',
      header: t('last.date.acronym'),
      render: (value) => {
        const dateObj = value ? new Date(value) : null;
        const colorUpdate = getColorUpdate(value);
        const dateValid = dateObj && isValid(dateObj);

        return (
          <ItemContent className="gap-0">
            <ItemTitle className={`${colorUpdate ? 'text-destructive' : ''}`}>{dateValid ? format(dateObj, 'dd MM yyyy') : '-'}</ItemTitle>
            {dateValid && <ItemDescription className={`${colorUpdate ? 'text-destructive' : ''}`}>{format(dateObj, 'HH:mm')}</ItemDescription>}
          </ItemContent>
        );
      },
      sortable: true,
    },
    {
      key: 'eta',
      header: 'ETA',
      render: (value) => {
        const dateObj = value ? new Date(value) : null;
        const dateValid = dateObj && isValid(dateObj);
        return (
          <ItemContent className="gap-0">
            <ItemTitle className="font-mono text-sm">{dateValid ? format(dateObj, 'dd MM yyyy') : '-'}</ItemTitle>
            {dateValid && <ItemDescription>{format(dateObj, 'HH:mm')}</ItemDescription>}
          </ItemContent>
        );
      },
      sortable: true,
    },
    {
      key: 'destiny',
      header: t('destiny.port'),
      render: (value) => (
        <div className="flex items-center gap-2">
          <Anchor className="size-3 text-muted-foreground" />
          <ItemDescription className="text-sm">{value || '-'}</ItemDescription>
        </div>
      ),
    },
    {
      key: 'integration',
      header: t('integration'),
      render: (value, row) => {
        const option = INTEGRATION_OPTIONS.find((opt) => opt.value === row.extra?.api);
        return (
          <ItemContent>
            {row.typeIntegration && (
              <Badge variant={row.typeIntegration === 'MIDDLEWARE' ? 'default' : 'secondary'} className="h-4 w-fit px-2 py-0 text-[10px]">
                {row.typeIntegration}
              </Badge>
            )}
            <div className="flex min-w-[120px] items-center gap-2">
              <MapPin className="size-3 text-muted-foreground" />
              <ItemDescription className="text-sm">{option ? `${option.label} (${option.value})` : value || '-'}</ItemDescription>
            </div>
          </ItemContent>
        );
      },
    },
    {
      key: 'status',
      header: t('status'),
      render: (_, row) => {
        const colorUpdate = getColorUpdate(row.date);
        if (!colorUpdate) return '-';
        return <Badge className={`px-2 text-xs ${colorUpdate.className}`}>{colorUpdate.text}</Badge>;
      },
    },
  ];

  const displayData = useMemo(() => {
    if (!data) return [];
    return [...data]
      .map((item) => ({
        ...item,
        name_search: `${item.name} ${item.dataSheet?.mmsi || ''} ${item.dataSheet?.imo || ''}`,
      }))
      .sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
      });
  }, [data]);

  return (
    <Card>
      <CardHeader title={t('status.fleet')} />
      <CardContent>
        {isLoading ? (
          <DefaultLoading />
        ) : !data || data.length === 0 ? (
          <EmptyData />
        ) : (
          <DataTable
            className="border-none p-0"
            compact
            bordered={false}
            data={displayData}
            columns={columns}
            searchable={true}
            searchPlaceholder={t('search.placeholder')}
            itemsPerPage={20}
          />
        )}
      </CardContent>
    </Card>
  );
}
