import { useTranslation } from 'react-i18next';
import EmptyData from '@/components/default-empty-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DataTable, type DataTableColumn } from '@/components/ui/data-table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { FleetCII } from '@/hooks/use-esg-api';
import { calculateRating, getRatingColor } from '../../indicators-eeoi-cii/@consts/cii.utils';

interface FleetCIITableProps {
  data: FleetCII[];
}

export function FleetCIITable({ data }: FleetCIITableProps) {
  const { t } = useTranslation();

  if (!data || data.length === 0) {
    return <EmptyData />;
  }

  const currentYear = new Date().getFullYear();
  const years = [2023, 2024, 2025, 2026, 2027];

  const columns: DataTableColumn<FleetCII>[] = [
    {
      key: 'image',
      header: '',
      render: (_, row) => (
        <Avatar className="size-10">
          <AvatarImage src={row.image?.url} alt={row.machineName} className="object-cover" />
          <AvatarFallback>{row.machineName.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      ),
      width: '60px',
    },
    {
      key: 'machineName',
      header: t('machine'),
      render: (_, row) => (
        <div className="flex flex-col">
          <span className="font-bold">{row.machineName}</span>
          <span className="text-xs text-muted-foreground">{row.code}</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'dataSheet',
      header: 'DWT',
      render: (_, row) => (row.dataSheet?.deadWeight ? new Intl.NumberFormat('pt-BR').format(row.dataSheet.deadWeight) : '-'),
      sortable: true,
    },
    {
      key: 'dataSheet',
      header: 'Gross Tonnage',
      render: (_, row) => (row.dataSheet?.grossTonnage ? new Intl.NumberFormat('pt-BR').format(row.dataSheet.grossTonnage) : '-'),
      sortable: true,
    },
    {
      key: 'ciiRef',
      header: 'CII Ref',
      render: (value) => (value ? new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(value) : '-'),
      sortable: true,
    },
    ...years.map((year): DataTableColumn<FleetCII> => {
      const reductionFactors: Record<number, number> = {
        2023: 0.05,
        2024: 0.07,
        2025: 0.09,
        2026: 0.11,
        2027: 0.13,
      };
      const factor = reductionFactors[year];

      return {
        key: `cii_${year}` as any,
        header: `${year} (${(factor * 100).toFixed(0)}%)`,
        render: (_, row) => {
          let ciiAttained: number | undefined;
          if (year === 2023) ciiAttained = row.cii_2023;
          else if (year === 2024) ciiAttained = row.cii_2024;
          else if (year === 2025)
            ciiAttained = row.cii; // Current/Projected for 2025 in legacy
          else ciiAttained = row.cii; // Same for future years in legacy

          if (!ciiAttained || !row.ciiRef || !row.dd) return '-';

          const ciiReq = row.ciiRef * (1 - factor);
          const rating = calculateRating(ciiAttained, row.ciiRef, `${year}-01-01`, row.dd);

          const statusKey = year === currentYear ? 'actual' : year < currentYear ? 'past' : 'projected';

          return (
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-muted-foreground uppercase">{t(statusKey)}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge className={getRatingColor(rating)}>{rating}</Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-xs">
                      <p>
                        CII Ref {year}: {ciiReq.toFixed(3)}
                      </p>
                      <p>CII Attained: {ciiAttained.toFixed(3)}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          );
        },
      };
    }),
  ];

  return <DataTable data={data} columns={columns} bordered={false} className="border-none shadow-none py-0" />;
}
