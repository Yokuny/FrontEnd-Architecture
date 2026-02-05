import { Ship } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import EmptyData from '@/components/default-empty-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DataTable, type DataTableColumn } from '@/components/ui/data-table';
import type { ConsumptionCO2Data } from '@/hooks/use-esg-api';

interface ConsumptionCO2TableProps {
  data: ConsumptionCO2Data[];
  selectedUnit: string;
}

export function ConsumptionCO2Table({ data, selectedUnit }: ConsumptionCO2TableProps) {
  const { t } = useTranslation();

  if (!data || data.length === 0) {
    return <EmptyData />;
  }

  const columns: DataTableColumn<ConsumptionCO2Data>[] = [
    {
      key: 'machine',
      header: t('machine'),
      width: '35%',
      render: (value) => (
        <div className="flex items-center gap-3">
          <Avatar className="size-10 border">
            <AvatarImage src={value?.image?.url} alt={value?.name} />
            <AvatarFallback className="bg-primary/10 text-primary">
              <Ship className="size-5" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight">{value?.name || '-'}</span>
            {value?.code && <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">{value.code}</span>}
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'totalFuel',
      header: t('consume'),
      render: (value, row) => {
        if (row.oilDetails && row.oilDetails.length > 0) {
          return (
            <div className="flex flex-col gap-1">
              {row.oilDetails.map((oil) => (
                <div key={oil.type} className="flex flex-col">
                  <span className="font-bold text-[10px] text-muted-foreground uppercase">{oil.type}</span>
                  <span className="font-bold font-mono text-primary text-sm">
                    {oil.consumption.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} <span className="text-[10px] text-muted-foreground">{oil.unit}</span>
                  </span>
                </div>
              ))}
            </div>
          );
        }
        return (
          <div className="flex flex-col">
            {row.type && <span className="font-bold text-[10px] text-muted-foreground uppercase">{row.type}</span>}
            <span className="font-bold font-mono text-primary text-sm">
              {(row.consumption || value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}{' '}
              <span className="text-[10px] text-muted-foreground">{row.unit || row.oilDetails?.[0]?.unit || selectedUnit}</span>
            </span>
          </div>
        );
      },
      sortable: true,
    },
    {
      key: 'totalCO2',
      header: 'CO2 Emitted',
      render: (value, row) => {
        const co2Kg = row.oilDetails && row.oilDetails.length > 0 ? row.oilDetails.reduce((acc, curr) => acc + curr.co2, 0) : row.co2 || value || 0;
        const co2Ton = co2Kg / 1000;

        return (
          <div className="flex flex-col gap-2">
            <div className="flex flex-col">
              <span className="font-bold font-mono text-foreground text-sm">
                {co2Kg.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} <span className="font-bold text-[10px] text-muted-foreground">KG</span>
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold font-mono text-primary text-sm">
                {co2Ton.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} <span className="font-bold text-[10px] text-primary">TON</span>
              </span>
            </div>
          </div>
        );
      },
      sortable: true,
    },
  ];

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <DataTable data={data} columns={columns} bordered={false} searchable={false} className="border-none py-0" />
    </div>
  );
}
