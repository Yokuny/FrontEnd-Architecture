import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useMonitoringWearDetails } from '../@hooks/use-monitoring-wear-api';

interface MonitoringWearDetailsProps {
  idMachine: string;
}

export function MonitoringWearDetails({ idMachine }: MonitoringWearDetailsProps) {
  const { t } = useTranslation();
  const { data: parts, isLoading } = useMonitoringWearDetails(idMachine);

  if (isLoading) {
    return (
      <Skeleton className="h-32 w-full flex items-center justify-center">
        <Spinner />
      </Skeleton>
    );
  }

  return (
    <div className="mt-4 border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('action')}</TableHead>
            <TableHead className="text-center">SKU</TableHead>
            <TableHead>{t('part')}</TableHead>
            <TableHead className="text-center">{t('image')}</TableHead>
            <TableHead className="text-center">{t('wear')}</TableHead>
            <TableHead className="text-center">%</TableHead>
            <TableHead className="text-center">{t('status')}</TableHead>
            <TableHead className="text-center">{t('last.date')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {parts?.map((part) => (
            <TableRow key={`${part.part.id}-${part.typeService.id}`}>
              <TableCell className="text-sm">{part.typeService.description}</TableCell>
              <TableCell className="text-center text-xs font-mono">{part.part.sku}</TableCell>
              <TableCell className="text-sm">{part.part.name}</TableCell>
              <TableCell className="text-center">
                {part.part.image?.url && <img src={part.part.image.url} alt={part.part.name} className="size-10 rounded object-cover mx-auto" />}
              </TableCell>
              <TableCell className="text-center font-medium">{part.wear}</TableCell>
              <TableCell className="text-center min-w-[100px]">
                <div className="flex flex-col gap-1 items-center">
                  <Progress value={part.percentual} className="h-2" />
                  <span className="text-[10px] text-muted-foreground">{part.percentual}%</span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                {part.percentual >= 100 ? <Badge variant="destructive">{t('late')}</Badge> : part.percentual > 90 ? <Badge variant="secondary">{t('next')}</Badge> : null}
              </TableCell>
              <TableCell className="text-center text-[10px] leading-tight">
                {part.lastModified ? (
                  <>
                    <div>{format(new Date(part.lastModified), 'dd/MM/yyyy')}</div>
                    <div>{format(new Date(part.lastModified), 'HH:mm')}</div>
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
  );
}
