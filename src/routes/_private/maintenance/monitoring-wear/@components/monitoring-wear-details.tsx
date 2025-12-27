import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useMonitoringWearDetails } from '../@hooks/use-monitoring-wear-api';
import { AdjustManualWear } from './adjust-manual-wear';

interface MonitoringWearDetailsProps {
  idMachine: string;
}

export function MonitoringWearDetails({ idMachine }: MonitoringWearDetailsProps) {
  const { t } = useTranslation();
  const { data: parts, isLoading, refetch } = useMonitoringWearDetails(idMachine);

  if (isLoading) {
    return (
      <Skeleton className="h-32 w-full flex items-center justify-center">
        <Spinner />
      </Skeleton>
    );
  }

  return (
    <div className="mt-4 border rounded-md overflow-hidden bg-background/50">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs uppercase text-muted-foreground">{t('action')}</TableHead>
            <TableHead className="text-xs text-center uppercase text-muted-foreground">SKU</TableHead>
            <TableHead className="text-xs uppercase text-muted-foreground">{t('part')}</TableHead>
            {/* <TableHead className="text-xs text-center uppercase text-muted-foreground">{t('image')}</TableHead> */}
            <TableHead className="text-xs text-center uppercase text-muted-foreground">{t('proportional')}</TableHead>
            <TableHead className="text-xs text-center uppercase text-muted-foreground">{t('max.contraction')}</TableHead>
            <TableHead className="text-xs text-center uppercase text-muted-foreground">{t('wear')}</TableHead>
            <TableHead className="text-xs text-center uppercase text-muted-foreground">{t('next.contraction')}</TableHead>
            <TableHead className="text-xs text-center uppercase text-muted-foreground">{t('unity.acronym')}</TableHead>
            <TableHead className="text-xs text-center uppercase text-muted-foreground">%</TableHead>
            <TableHead className="text-xs text-center uppercase text-muted-foreground">{t('status')}</TableHead>
            <TableHead className="text-xs text-center uppercase text-muted-foreground">{t('last.date.acronym')}</TableHead>
            <TableHead className="text-xs text-center uppercase text-muted-foreground w-12">Op.</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {parts?.map((part) => {
            const action = part.wearConfig?.actions?.find((x) => x.typeService.value === part.typeService.id);
            const nextContraction = (part.lastWearDone || 0) + (action?.valueCycle || 0);

            return (
              <TableRow key={`${part.part.id}-${part.typeService.id}`} className="hover:bg-accent/5 transition-colors">
                <TableCell className="text-sm py-3">{part.typeService.description}</TableCell>
                <TableCell className="text-center text-xs font-mono">{part.part.sku}</TableCell>
                <TableCell className="text-sm">{part.part.name}</TableCell>
                {/* <TableCell className="text-center text-xs text-muted-foreground">{part.part.image?.url || '-'}</TableCell> */}
                <TableCell className="text-center text-sm">{part.wearConfig?.proportional ? `${part.wearConfig.proportional}%` : '-'}</TableCell>
                <TableCell className="text-center text-sm">{action?.valueCycle ?? 0}</TableCell>
                <TableCell className="text-center font-semibold text-sm">{part.wear}</TableCell>
                <TableCell className="text-center text-sm">{nextContraction}</TableCell>
                <TableCell className="text-center text-sm">{action?.unityCycle ? t(action.unityCycle) : '-'}</TableCell>
                <TableCell className="text-center min-w-[100px]">
                  <div className="flex flex-col gap-1 items-center">
                    <Progress value={part.percentual} className="h-2 w-16" />
                    <span className="text-[10px] text-muted-foreground font-medium">{part.percentual}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    {part.percentual >= 100 ? (
                      <Badge variant="destructive" className="h-6 whitespace-nowrap">
                        {t('late')}
                      </Badge>
                    ) : part.percentual > 90 ? (
                      <Badge className="h-6 bg-yellow-500 hover:bg-yellow-600 text-white whitespace-nowrap border-none">{t('next')}</Badge>
                    ) : (
                      <div className="min-h-6" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center text-[10px] leading-tight text-muted-foreground">
                  {part.lastModified ? (
                    <>
                      <div className="font-medium text-foreground">{format(new Date(part.lastModified), 'dd/MM/yyyy')}</div>
                      <div>{format(new Date(part.lastModified), 'HH:mm')}</div>
                    </>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell className="text-center p-2">
                  <AdjustManualWear
                    idMachine={idMachine}
                    idPart={part.part.id}
                    idTypeService={part.typeService.id}
                    idWearConfig={part.wearConfig.id}
                    partName={part.part.name}
                    actionName={part.typeService.description}
                    onRefresh={refetch} // Use refetch from useMonitoringWearDetails
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
