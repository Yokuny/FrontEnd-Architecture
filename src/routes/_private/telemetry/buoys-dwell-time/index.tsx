import { createFileRoute } from '@tanstack/react-router';
import { Clock, Radio } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ItemDescription, ItemTitle } from '@/components/ui/item';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { formatDate } from '@/lib/formatDate';
import { useBuoysDwellTimeQuery } from './@hooks/use-buoys-dwell-time';
import { calculateTimeDifference, calculateTotalTimeSpent, getDelimitationName } from './@utils/buoys-dwell-time.utils';

export const Route = createFileRoute('/_private/telemetry/buoys-dwell-time/')({
  component: BuoysDwellTimePage,
});

function BuoysDwellTimePage() {
  const { t } = useTranslation();
  const { idEnterprise } = useEnterpriseFilter();

  const { data, isLoading } = useBuoysDwellTimeQuery(idEnterprise);

  return (
    <Card>
      <CardHeader title={t('telemetry.buoys.dwell.time')} />

      <CardContent>
        {isLoading ? (
          <DefaultLoading />
        ) : !data?.length ? (
          <DefaultEmptyData />
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {data.map((buoy) => (
              <AccordionItem key={buoy.id} value={buoy.id}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex w-full items-center justify-between pr-4">
                    <div className="flex items-center gap-3">
                      <Radio className="size-4" />
                      <div className="flex flex-col items-start">
                        <ItemTitle>{buoy.name}</ItemTitle>
                        <ItemDescription>{buoy.proximity}</ItemDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="size-4 text-muted-foreground" />
                      <ItemTitle>{calculateTotalTimeSpent(buoy.dwellTimes)}</ItemTitle>
                      <ItemDescription>HR</ItemDescription>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t('delimitation')}</TableHead>
                          <TableHead>{t('vessel')}</TableHead>
                          <TableHead>{t('mmsi')}</TableHead>
                          <TableHead className="text-center">{t('hour.start')}</TableHead>
                          <TableHead className="text-center">{t('hour.end')}</TableHead>
                          <TableHead className="text-center">{t('total.time')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {buoy.dwellTimes.map((dt, i) => (
                          <TableRow key={`${buoy.location}${i}`}>
                            <TableCell>
                              <ItemTitle>{getDelimitationName(buoy.location, dt.idDelimitation)}</ItemTitle>
                            </TableCell>
                            <TableCell>
                              <ItemTitle>{dt.machine?.name || '-'}</ItemTitle>
                            </TableCell>
                            <TableCell>{dt.machine?.mmsi || '-'}</TableCell>
                            <TableCell className="text-center">{formatDate(new Date(dt.inAt), 'dd MMM yyyy HH:mm')}</TableCell>
                            <TableCell className="text-center">{dt.outAt ? formatDate(new Date(dt.outAt), 'dd MMM yyyy HH:mm') : '-'}</TableCell>
                            <TableCell className="text-center">
                              {dt.outAt ? (
                                <>
                                  {calculateTimeDifference(dt.inAt, dt.outAt)} <span className="text-muted-foreground text-xs">HR</span>
                                </>
                              ) : (
                                '-'
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
