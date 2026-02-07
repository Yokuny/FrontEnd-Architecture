import { createFileRoute } from '@tanstack/react-router';
import { Clock, MinusIcon, PlusIcon, Radio } from 'lucide-react';
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
  staticData: {
    title: 'telemetry.buoys-dwell-time',
    description:
      'Análise de tempo de permanência de embarcações em áreas delimitadas (boias/balizas). Exibe histórico de entrada/saída de embarcações em zonas de proximidade, com cálculo de tempo total de permanência e identificação por MMSI.',
    tags: ['buoys', 'boias', 'dwell-time', 'geofencing', 'proximity', 'delimitation', 'maritime-zones', 'tracking', 'permanencia'],
    examplePrompts: ['Ver tempo de permanência em boias', 'Analisar embarcações que passaram por áreas delimitadas', 'Consultar histórico de entrada/saída em zonas'],
    relatedRoutes: [
      { path: '/_private/telemetry', relation: 'parent', description: 'Hub de telemetria' },
      { path: '/_private/telemetry/fleet-panel', relation: 'sibling', description: 'Painel da frota' },
      { path: '/_private/register/delimitations', relation: 'alternative', description: 'Cadastro de delimitações' },
    ],
    entities: ['Buoy', 'Delimitation', 'Machine', 'DwellTime'],
    capabilities: [
      'Lista de boias/zonas delimitadas',
      'Tempo total de permanência por zona',
      'Histórico de entradas e saídas',
      'Identificação de embarcações (nome, MMSI)',
      'Cálculo automático de tempo (horas)',
      'Accordion expansível por boia',
    ],
  },
});

function BuoysDwellTimePage() {
  const { t } = useTranslation();
  const { idEnterprise } = useEnterpriseFilter();

  const { data, isLoading } = useBuoysDwellTimeQuery(idEnterprise);

  return (
    <Card>
      <CardHeader />

      <CardContent>
        {isLoading ? (
          <DefaultLoading />
        ) : !data?.length ? (
          <DefaultEmptyData />
        ) : (
          <Accordion type="single" collapsible className="flex w-full flex-col gap-2">
            {data.map((buoy) => (
              <AccordionItem key={buoy.id} value={buoy.id} className="overflow-hidden rounded-lg border bg-background px-4 last:border-b">
                <AccordionTrigger className="group hover:no-underline [&>svg]:hidden">
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative size-4 shrink-0">
                        <PlusIcon className="absolute inset-0 size-4 text-muted-foreground transition-opacity duration-200 group-data-[state=open]:opacity-0" />
                        <MinusIcon className="absolute inset-0 size-4 text-muted-foreground opacity-0 transition-opacity duration-200 group-data-[state=open]:opacity-100" />
                      </div>
                      <Radio className="size-4" />
                      <div className="flex flex-col items-start">
                        <ItemTitle>{buoy.name}</ItemTitle>
                        <ItemDescription>{buoy.proximity}</ItemDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pr-4 text-sm">
                      <Clock className="size-4 text-muted-foreground" />
                      <ItemTitle>{calculateTotalTimeSpent(buoy.dwellTimes)}</ItemTitle>
                      <ItemDescription>HR</ItemDescription>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="ps-14">
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
