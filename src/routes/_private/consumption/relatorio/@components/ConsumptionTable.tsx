import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/formatDate';
import type { ConsumptionIntervalData } from '../@interface/consumption-interval.types';

interface ConsumptionTableProps {
  data: ConsumptionIntervalData[];
  unit: string;
  isReal: boolean;
  isEstimated: boolean;
}

export function ConsumptionTable({ data, unit, isReal, isEstimated }: ConsumptionTableProps) {
  const { t } = useTranslation();

  const engines = Array.from(new Set(data?.flatMap((x) => x?.engines?.map((y) => y?.description)))).filter(Boolean);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-secondary/50">
              <TableRow>
                <TableHead className="text-center">{t('date')}</TableHead>
                <TableHead className="text-center">{t('vessel')}</TableHead>
                {isReal && (
                  <>
                    <TableHead className="text-right">
                      {t('polling')} ({unit})
                    </TableHead>
                    <TableHead className="text-right">CO₂ {t('polling')} (Ton)</TableHead>
                  </>
                )}
                {isEstimated && (
                  <>
                    <TableHead className="text-right">
                      {t('flowmeter')} ({unit})
                    </TableHead>
                    <TableHead className="text-right">CO₂ {t('flowmeter')} (Ton)</TableHead>
                  </>
                )}
                <TableHead className="text-right">
                  {t('stock')} ({unit})
                </TableHead>
                {engines.map((engine) => (
                  <React.Fragment key={engine}>
                    <TableHead className="text-right">{engine}</TableHead>
                    <TableHead className="text-right">{engine} HR</TableHead>
                  </React.Fragment>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={item._id || index}>
                  <TableCell className="whitespace-nowrap text-center">{formatDate(item.date, 'dd MMM yyyy')}</TableCell>
                  <TableCell className="text-center font-medium">{item.machine.name}</TableCell>
                  {isReal && (
                    <>
                      <TableCell className="text-right font-mono">{item.consumptionReal?.value ? item.consumptionReal.value.toFixed(2) : '-'}</TableCell>
                      <TableCell className="text-right font-mono">{item.consumptionReal?.co2 ? (item.consumptionReal.co2 / 1000).toFixed(2) : '-'}</TableCell>
                    </>
                  )}
                  {isEstimated && (
                    <>
                      <TableCell className="text-right font-mono">{item.consumption?.value ? item.consumption.value.toFixed(2) : '-'}</TableCell>
                      <TableCell className="text-right font-mono">{item.consumption?.co2 ? (item.consumption.co2 / 1000).toFixed(2) : '-'}</TableCell>
                    </>
                  )}
                  <TableCell className="text-right font-mono">{item.oil?.stock ? item.oil.stock.toFixed(2) : '-'}</TableCell>
                  {engines.map((engine) => {
                    const engineData = item.engines?.find((e) => e.description === engine);
                    return (
                      <React.Fragment key={engine}>
                        <TableCell className="text-right font-mono">{engineData?.consumption?.value ? engineData.consumption.value.toFixed(2) : '-'}</TableCell>
                        <TableCell className="text-right font-mono">{engineData?.hours ? engineData.hours.toFixed(2) : '-'}</TableCell>
                      </React.Fragment>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
