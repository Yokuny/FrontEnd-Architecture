import { differenceInMinutes, format } from 'date-fns';
import { Download, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import type { Operation, RDO } from '../@interface/rve-sounding.types';
import { formatNumber } from '../@utils/format';

interface ModalViewDetailsProps {
  operations: Operation[];
  rdo: RDO[];
}

export function ModalViewDetails({ operations, rdo }: ModalViewDetailsProps) {
  const { t } = useTranslation();

  const calculateDuration = (start: Date, end: Date) => {
    const diff = Math.abs(differenceInMinutes(end, start));
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  const totalReceived = rdo.reduce((acc, x) => acc + (x.received || 0), 0);
  const totalSupplied = rdo.reduce((acc, x) => acc + (x.supply || 0), 0);

  const filteredRDO = rdo.filter((x) => x.received || x.supply).sort((a, b) => b.date.getTime() - a.date.getTime());

  // Group operations by day for the table display similar to legacy
  const groupedOperations = operations.reduce(
    (acc, op) => {
      const day = format(op.dateStart, 'yyyy-MM-dd');
      if (!acc[day]) acc[day] = [];
      acc[day].push(op);
      return acc;
    },
    {} as Record<string, Operation[]>,
  );

  const sortedDays = Object.keys(groupedOperations).sort((a, b) => b.localeCompare(a));

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('polling')}</DialogTitle>
        </DialogHeader>

        <div className="mt-4 grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* RDO Table */}
          <div className="space-y-4">
            <h3 className="text-center font-bold text-muted-foreground text-sm uppercase">RDO</h3>
            <div className="overflow-hidden rounded-md border">
              <table className="w-full text-xs">
                <thead className="bg-muted text-muted-foreground">
                  <tr>
                    <th className="p-2 text-center font-semibold uppercase">{t('date')}</th>
                    <th className="p-2 text-center font-semibold uppercase">{t('hour')}</th>
                    <th className="p-2 text-right font-semibold uppercase">{t('machine.supplies.consumption.received')} (m³)</th>
                    <th className="p-2 text-right font-semibold uppercase">{t('machine.supplies.consumption.supplied')} (m³)</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredRDO.map((x, i) => (
                    <tr key={`rdo-${x.date.getTime()}`} className={i % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                      <td className="p-2 text-center">{format(x.date, 'dd MMM yyyy')}</td>
                      <td className="p-2 text-center">{format(x.date, 'HH:mm')}</td>
                      <td className="p-2 text-right">{formatNumber(x.received, 3)}</td>
                      <td className="p-2 text-right">{formatNumber(x.supply, 3)}</td>
                    </tr>
                  ))}
                  <tr className="bg-muted font-bold">
                    <td colSpan={2} className="p-2 text-right uppercase">
                      {t('total')}
                    </td>
                    <td className="p-2 text-right">{formatNumber(totalReceived, 3)}</td>
                    <td className="p-2 text-right">{formatNumber(totalSupplied, 3)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex justify-center">
              <Button variant="ghost" size="sm" className="text-[10px]">
                <Download className="mr-1 h-3 w-3" />
                {t('download')} CSV
              </Button>
            </div>
          </div>

          {/* RVE Table */}
          <div className="space-y-4">
            <h3 className="text-center font-bold text-muted-foreground text-sm uppercase">RVE</h3>
            <div className="overflow-hidden rounded-md border">
              <table className="w-full text-xs">
                <thead className="bg-muted text-muted-foreground">
                  <tr>
                    <th className="p-2 text-center font-semibold uppercase">{t('date')}</th>
                    <th className="p-2 text-center font-semibold uppercase">{t('operation')}</th>
                    <th className="p-2 text-center font-semibold uppercase">{t('start')}</th>
                    <th className="p-2 text-center font-semibold uppercase">{t('end')}</th>
                    <th className="p-2 text-center font-semibold uppercase">{t('duration')}</th>
                    <th className="p-2 text-right font-semibold uppercase">{t('contract.max')} (m³)</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {sortedDays.flatMap((day, dayIndex) => {
                    const ops = groupedOperations[day];
                    return ops.map((x, opIndex) => {
                      const diffInHours = (x.dateEnd.getTime() - x.dateStart.getTime()) / 36e5;
                      const contractMax = (x.consumptionDailyContract / 24) * diffInHours;

                      return (
                        <tr key={`${day}-${x.code}-${x.dateStart.getTime()}`} className={dayIndex % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                          {opIndex === 0 && (
                            <td className="p-2 text-center align-middle" rowSpan={ops.length}>
                              {format(x.dateStart, 'dd MMM yyyy')}
                            </td>
                          )}
                          <td className="p-2 text-center">{x.code}</td>
                          <td className="p-2 text-center">{format(x.dateStart, 'HH:mm')}</td>
                          <td className="p-2 text-center">{format(x.dateEnd, 'HH:mm')}</td>
                          <td className="p-2 text-center">{calculateDuration(x.dateStart, x.dateEnd)}</td>
                          <td className="p-2 text-right font-medium">{formatNumber(contractMax, 2)}</td>
                        </tr>
                      );
                    });
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex justify-center">
              <Button variant="ghost" size="sm" className="text-[10px]">
                <Download className="mr-1 h-3 w-3" />
                {t('download')} CSV
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
