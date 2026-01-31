import { format } from 'date-fns';
import { AlertTriangle, ArrowDownCircle, ArrowUpCircle, ChevronDown, ChevronUp, Clock, Droplet, Info, TrendingDown, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { Operation, RDO, Sounding } from '../@interface/rve-sounding.types';
import { formatNumber } from '../@utils/format';
import { TableListRVESounding } from './table-list-rve-sounding';

interface ItemPeriodSoundingProps {
  data: {
    operations: Operation[];
    sounding: Sounding[];
    rdo: RDO[];
  };
}

export function ItemPeriodSounding({ data }: ItemPeriodSoundingProps) {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const totalRegisters = data.sounding.length;
  const periodCount = Math.ceil(totalRegisters / 3);

  return (
    <div className="space-y-4">
      {Array.from({ length: periodCount }).map((_, i) => {
        const dataInThisPeriod = data.sounding.slice(i * 3, i * 3 + 4);
        if (dataInThisPeriod.length === 0) return null;

        const first = dataInThisPeriod[0];
        const last = dataInThisPeriod[dataInThisPeriod.length - 1];

        const rdosInThisInterval = data.rdo.filter((rdo) => rdo.date >= first.date && rdo.date <= last.date);

        const operationsInThisInterval = data.operations.filter((op) => op.dateStart >= first.date && op.dateStart <= last.date);

        const totalReceive = rdosInThisInterval.reduce((acc, rdo) => acc + rdo.received, 0);
        const totalSupply = rdosInThisInterval.reduce((acc, rdo) => acc + rdo.supply, 0);

        const consumed = dataInThisPeriod.length > 1 ? first.volume + totalReceive - (last.volume + totalSupply) : 0;

        const maxAllow = operationsInThisInterval.reduce((acc, op) => {
          const diffInHours = (op.dateEnd.getTime() - op.dateStart.getTime()) / 36e5;
          return acc + (op.consumptionDailyContract ? (op.consumptionDailyContract / 24) * diffInHours : 0);
        }, 0);

        const isExcess = consumed > maxAllow && consumed > 0;
        const isOpen = openIndex === i;

        return (
          <Card key={`period-${first.date.getTime()}`} className="border">
            <CardHeader className="p-4">
              <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-12">
                {/* Start */}
                <div className="flex flex-col md:col-span-2">
                  <span className="mb-1 font-semibold text-[10px] text-muted-foreground uppercase">{t('start')}</span>
                  <div className="flex items-center gap-1 font-medium text-sm">
                    <Clock className="size-3 text-muted-foreground" />
                    {format(first.date, 'dd MMM, HH:mm')}
                  </div>
                  <div className="flex items-center gap-1 font-bold text-base text-sky-500">
                    <Droplet className="size-4" />
                    {formatNumber(first.volume, 3)}
                    <span className="ml-1 font-normal text-[10px] text-muted-foreground">m³</span>
                  </div>
                </div>

                {/* End */}
                <div className="flex flex-col md:col-span-2">
                  <span className="mb-1 font-semibold text-[10px] text-muted-foreground uppercase">{t('end')}</span>
                  <div className="flex items-center gap-1 font-medium text-sm">
                    <Clock className="size-3 text-muted-foreground" />
                    {format(last.date, 'dd MMM, HH:mm')}
                  </div>
                  <div className="flex items-center gap-1 font-bold text-base text-sky-500">
                    <Droplet className="size-4" />
                    {formatNumber(last.volume, 3)}
                    <span className="ml-1 font-normal text-[10px] text-muted-foreground">m³</span>
                  </div>
                </div>

                {/* Moving */}
                <div className="flex flex-col md:col-span-2">
                  <span className="mb-1 font-semibold text-[10px] text-muted-foreground uppercase">{t('moving')}</span>
                  <div className="flex items-center gap-1 text-xs">
                    <ArrowDownCircle className="size-3 text-green-500" />
                    {formatNumber(totalReceive, 3)} m³
                    <span className="text-[10px] text-muted-foreground">{t('machine.supplies.consumption.received')}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <ArrowUpCircle className="size-3 text-orange-500" />
                    {formatNumber(totalSupply, 3)} m³
                    <span className="text-[10px] text-muted-foreground">{t('machine.supplies.consumption.supplied')}</span>
                  </div>
                </div>

                {/* Maximum */}
                <div className="flex flex-col md:col-span-2">
                  <span className="mb-1 font-semibold text-[10px] text-muted-foreground uppercase">{t('maximum')}</span>
                  <div className="flex items-center gap-1 font-medium text-sm">
                    <TrendingUp className={isExcess ? 'text-red-500' : 'text-muted-foreground'} size={14} />
                    {formatNumber(maxAllow, 3)}
                    <span className="ml-1 font-normal text-[10px] text-muted-foreground">m³</span>
                  </div>
                </div>

                {/* Consumption */}
                <div className="flex flex-col md:col-span-2">
                  <span className="mb-1 font-semibold text-[10px] text-muted-foreground uppercase">{t('consume')}</span>
                  <div className="flex items-center gap-1 font-bold text-lg">
                    <Droplet className={isExcess ? 'text-red-500' : 'text-green-500'} size={16} />
                    {formatNumber(consumed, 3)}
                    <span className="ml-1 font-normal text-[10px] text-muted-foreground">m³</span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center justify-center md:col-span-1">
                  {dataInThisPeriod.length >= 4 ? (
                    isExcess ? (
                      <div className="flex items-center gap-1 rounded border border-red-500 px-2 py-1 font-bold text-[10px] text-red-500">
                        <AlertTriangle size={12} />
                        {t('in.excess')}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 rounded border border-green-500 px-2 py-1 font-bold text-[10px] text-green-500">
                        <TrendingDown size={12} />
                        {t('below.contract')}
                      </div>
                    )
                  ) : (
                    <div className="flex items-center gap-1 rounded border border-orange-500 px-2 py-1 font-bold text-[10px] text-orange-500">
                      <Info size={12} />
                      {t('period.not.close')}
                    </div>
                  )}
                </div>

                {/* Toggle Action */}
                <div className="flex justify-end md:col-span-1">
                  <Button variant="ghost" size="sm" onClick={() => setOpenIndex(isOpen ? null : i)}>
                    {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                  </Button>
                </div>
              </div>
            </CardHeader>
            {isOpen && (
              <CardContent className="border-t bg-muted/20 p-4">
                <TableListRVESounding data={{ ...data, sounding: dataInThisPeriod }} />
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}
