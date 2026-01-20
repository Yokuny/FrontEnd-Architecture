import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ItemTitle } from '@/components/ui/item';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import type { NormalizedRVERDO } from '../@interface/rve-rdo.types';

interface RVERDOTableProps {
  data: NormalizedRVERDO[];
}

export function RVERDOTable({ data }: RVERDOTableProps) {
  const { t } = useTranslation();

  const sortedData = [...data].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-secondary/50">
          <TableRow>
            <TableHead className="text-center">{t('date')}</TableHead>
            <TableHead className="text-right">
              {t('consumption')} {t('estimated')} (m³)
            </TableHead>
            <TableHead className="text-right">
              {t('consumption.max')}
              <br />
              {t('day')} (m³)
            </TableHead>
            <TableHead className="text-right">{t('diff')}</TableHead>
            <TableHead className="text-center">{t('operation')}</TableHead>
            <TableHead className="text-center">{t('start')}</TableHead>
            <TableHead className="text-center">{t('end')}</TableHead>
            <TableHead className="text-center">{t('duration')}</TableHead>
            <TableHead className="text-right">
              {t('consumption.max')}
              <br />
              {t('operation')} (m³)
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((item, index) => {
            const maxInThisDay = item.operations.reduce(
              (acc, operation) => acc + (operation.consumptionDailyContract ? (operation.consumptionDailyContract / 24) * operation.diffInHours : 0),
              0,
            );

            const consumptionEstimated = item.consumptionEstimated;
            const diffValue = consumptionEstimated !== undefined ? consumptionEstimated - maxInThisDay : 0;
            const diffPercent = consumptionEstimated ? (1 - maxInThisDay / consumptionEstimated) * 100 : 0;

            const statusClass = maxInThisDay === 0 ? '' : consumptionEstimated !== undefined && maxInThisDay <= consumptionEstimated ? 'text-red-500 font-bold' : 'text-primary';

            return item.operations.map((operation, opIndex) => (
              <TableRow key={`${item.date.getTime()}-${opIndex}`} className={index % 2 === 0 ? 'bg-muted/30' : ''}>
                {opIndex === 0 && (
                  <>
                    <TableCell className="text-center" rowSpan={item.operations.length}>
                      <ItemTitle className="text-sm">{format(item.date, 'dd MMM', { locale: ptBR })}</ItemTitle>
                    </TableCell>
                    <TableCell className="text-right font-mono" rowSpan={item.operations.length}>
                      {consumptionEstimated === undefined ? (
                        <div className="flex items-center justify-end gap-1 text-amber-500">
                          <AlertCircle className="size-3" />
                          <span className="text-[10px] uppercase">{t('not.provided')}</span>
                        </div>
                      ) : (
                        consumptionEstimated.toFixed(3)
                      )}
                    </TableCell>
                    <TableCell className="text-right font-mono" rowSpan={item.operations.length}>
                      {maxInThisDay.toFixed(3)}
                    </TableCell>
                    <TableCell className={cn('text-right font-mono', statusClass)} rowSpan={item.operations.length}>
                      <div className="flex flex-col">
                        <span>{diffPercent.toFixed(2)} %</span>
                        <span className="text-xs">{diffValue.toFixed(2)} m³</span>
                      </div>
                    </TableCell>
                  </>
                )}
                <TableCell className="text-center">{operation.code}</TableCell>
                <TableCell className="text-center font-mono">{format(operation.dateStart, 'HH:mm')}</TableCell>
                <TableCell className="text-center font-mono">{format(operation.dateEnd, 'HH:mm')}</TableCell>
                <TableCell className="text-center font-mono">{operation.diffInHours.toFixed(2)} h</TableCell>
                <TableCell className="text-right font-mono">{((operation.consumptionDailyContract / 24) * operation.diffInHours).toFixed(2)}</TableCell>
              </TableRow>
            ));
          })}
        </TableBody>
      </Table>
    </div>
  );
}
