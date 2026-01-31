import { useTranslation } from 'react-i18next';
import EmptyData from '@/components/default-empty-data';
import { Badge } from '@/components/ui/badge';
import { DataTable, type DataTableColumn } from '@/components/ui/data-table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { EEOICIIIndicator } from '@/hooks/use-esg-api';
import { calculateCiiReq, calculateRating, getFactorByDate, getRatingColor } from '../@consts/cii.utils';
import { FUEL_TYPES_MAP } from '../@consts/fuel.consts';

export function IndicatorsTableDetails({ data }: IndicatorsTableDetailsProps) {
  const { t } = useTranslation();

  if (!data || data.length === 0) {
    return <EmptyData />;
  }

  const columns: DataTableColumn<EEOICIIIndicator>[] = [
    {
      key: 'code',
      header: t('travel'),
      sortable: true,
    },
    {
      key: 'sequence',
      header: 'Seq.',
      sortable: true,
    },
    {
      key: 'activities',
      header: 'Oper.',
      sortable: true,
    },
    {
      key: 'distance',
      header: `${t('distance')} (nm)`,
      render: (value) => (value != null ? Number(value).toFixed(2) : '0.00'),
      sortable: true,
    },
    {
      key: 'timeInVoyage',
      header: `${t('speed')} * ${t('medium')} (kn)`,
      render: (value, row) => (Number(value) > 0 ? (row.distanceInVoyage / Number(value)).toFixed(1) : '0.0'),
    },
    {
      key: 'consumption',
      header: `${t('consume')} Total (Ton)`,
      render: (value) => {
        const consumption = value as Record<string, number>;
        return (
          <div className="flex flex-col gap-1">
            {Object.entries(consumption || {})
              .filter(([_, amount]) => amount > 0)
              .sort(([, a], [, b]) => b - a)
              .map(([fuel, amount]) => (
                <div key={fuel} className="flex items-center gap-2">
                  <span className="font-bold">{amount.toFixed(1)}</span>
                  <Badge variant="secondary" className="h-4 px-1 py-0 text-[10px]">
                    {FUEL_TYPES_MAP[fuel] || fuel}
                  </Badge>
                </div>
              ))}
          </div>
        );
      },
    },
    {
      key: 'co2',
      header: 'CO2 (Ton)',
      render: (value) => (value != null ? Number(value).toFixed(1) : '0.0'),
      sortable: true,
    },
    {
      key: 'eeoi',
      header: 'EEOI',
      render: (value) => (value != null ? Number(value).toFixed(2) : '0.00'),
      sortable: true,
    },
    {
      key: 'ciiAttained',
      header: 'CII Rating',
      render: (value, row) => {
        const ciiAttained = Number(value);
        const rating = calculateRating(ciiAttained, row.ciiRef, row.dateTimeEnd, row.dd);

        if (rating === '-') return '-';

        const ciiReq = calculateCiiReq(row.ciiRef, row.dateTimeEnd);

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge className={getRatingColor(rating)}>{rating}</Badge>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-xs">
                  <p>
                    {new Date(row.dateTimeEnd).getFullYear()} ({(getFactorByDate(row.dateTimeEnd) * 100).toFixed(0)}%)
                  </p>
                  <p>CII Req: {ciiReq.toFixed(2)}</p>
                  <p>CII Attained: {ciiAttained.toFixed(2)}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
      sortable: true,
    },
  ];

  return <DataTable data={data} columns={columns} bordered={false} className="border-none py-0" />;
}

interface IndicatorsTableDetailsProps {
  data: EEOICIIIndicator[];
}
