import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import type { Operation, RDO, Sounding } from '../@interface/rve-sounding.types';
import { formatNumber } from '../@utils/format';
import { ModalViewDetails } from './modal-view-details';

interface TableListRVESoundingProps {
  data: {
    operations: Operation[];
    sounding: Sounding[];
    rdo: RDO[];
  };
}

export function TableListRVESounding({ data }: TableListRVESoundingProps) {
  const { t } = useTranslation();

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left text-xs font-semibold text-muted-foreground uppercase" colSpan={2}>
              {t('polling.start')}
              <div className="flex justify-between mt-1 text-[10px]">
                <span>{t('date')}</span>
                <span>{t('volume')} (m³)</span>
              </div>
            </th>
            <th className="p-2 text-left text-xs font-semibold text-muted-foreground uppercase" colSpan={2}>
              {t('polling.next')}
              <div className="flex justify-between mt-1 text-[10px]">
                <span>{t('date')}</span>
                <span>{t('volume')} (m³)</span>
              </div>
            </th>
            <th className="p-2 text-right text-xs font-semibold text-muted-foreground uppercase">{t('machine.supplies.consumption.received')} (m³)</th>
            <th className="p-2 text-right text-xs font-semibold text-muted-foreground uppercase">{t('machine.supplies.consumption.supplied')} (m³)</th>
            <th className="p-2 text-right text-xs font-semibold text-muted-foreground uppercase">
              {t('consumption')} {t('period')} (m³)
            </th>
            <th className="p-2 text-right text-xs font-semibold text-muted-foreground uppercase">{t('contract.max')} (m³)</th>
            <th className="p-2 text-center text-xs font-semibold text-muted-foreground uppercase">{t('status')}</th>
            <th className="p-2 text-right text-xs font-semibold text-muted-foreground uppercase">{t('diff')}</th>
            <th className="p-2 text-center text-xs font-semibold text-muted-foreground uppercase">{t('actions')}</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {data.sounding.map((item, index) => {
            if (index >= 3) return null;

            const nextItem = index < data.sounding.length - 1 ? data.sounding[index + 1] : null;

            const operationsInThisInterval = data.operations.filter((op) => op.dateStart >= item.date && op.dateStart <= (nextItem?.date || new Date()));

            const rdosInThisInterval = data.rdo.filter((rdo) => rdo.date >= item.date && rdo.date <= (nextItem?.date || new Date()));

            const totalReceive = rdosInThisInterval.reduce((acc, rdo) => acc + rdo.received, 0);
            const totalSupply = rdosInThisInterval.reduce((acc, rdo) => acc + rdo.supply, 0);

            const maxAllow = operationsInThisInterval.reduce((acc, op) => {
              const diffInHours = (op.dateEnd.getTime() - op.dateStart.getTime()) / 36e5;
              return acc + (op.consumptionDailyContract ? (op.consumptionDailyContract / 24) * diffInHours : 0);
            }, 0);

            const consumed = nextItem ? item.volume + totalReceive - (nextItem.volume + totalSupply) : 0;
            const diffPercentual = consumed > 0 ? (1 - maxAllow / consumed) * 100 : 0;
            const isExcess = consumed > maxAllow && consumed > 0;

            return (
              <tr key={index} className="hover:bg-muted/50">
                <td className="p-2 text-center whitespace-nowrap">
                  <div className="text-sm">{format(item.date, 'dd MMM yyyy')}</div>
                  <div className="text-xs text-muted-foreground">{format(item.date, 'HH:mm')}</div>
                </td>
                <td className="p-2 text-right font-medium">{formatNumber(item.volume, 3)}</td>
                <td className="p-2 text-center whitespace-nowrap">
                  {nextItem ? (
                    <>
                      <div className="text-sm">{format(nextItem.date, 'dd MMM yyyy')}</div>
                      <div className="text-xs text-muted-foreground">{format(nextItem.date, 'HH:mm')}</div>
                    </>
                  ) : null}
                </td>
                <td className="p-2 text-right font-medium">{nextItem ? formatNumber(nextItem.volume, 3) : ''}</td>
                <td className="p-2 text-right text-sm">{nextItem ? formatNumber(totalReceive, 3) : ''}</td>
                <td className="p-2 text-right text-sm">{nextItem ? formatNumber(totalSupply, 3) : ''}</td>
                <td className="p-2 text-right font-semibold">{nextItem ? formatNumber(consumed, 3) : ''}</td>
                <td className="p-2 text-right text-sm">{formatNumber(maxAllow, 3)}</td>
                <td className="p-2 text-center">
                  {nextItem && (
                    <span
                      className={cn(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
                        isExcess ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800',
                      )}
                    >
                      {t(isExcess ? 'in.excess' : 'below.contract')}
                    </span>
                  )}
                </td>
                <td className="p-2 text-right whitespace-nowrap">
                  {nextItem && (
                    <div className="flex flex-col items-end">
                      {isExcess && <span className="bg-red-500 text-white text-[10px] px-1 rounded mb-1">{formatNumber(diffPercentual, 1)}%</span>}
                      <span className={cn('text-sm font-semibold', isExcess ? 'text-red-500' : 'text-foreground')}>
                        {isExcess ? '' : '-'}
                        {formatNumber(Math.abs(maxAllow - consumed), 1)} m³
                      </span>
                    </div>
                  )}
                </td>
                <td className="p-2 text-center">
                  <ModalViewDetails operations={operationsInThisInterval} rdo={rdosInThisInterval} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
