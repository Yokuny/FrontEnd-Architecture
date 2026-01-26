import { Ship } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ItemDescription, ItemTitle } from '@/components/ui/item';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/formatDate';
import { cn } from '@/lib/utils';
import { getIconStatusOperation, getStatusColor } from '../@consts/status.consts';
import type { AssetOperationalRanking } from '../@interface/operational-dashboard.types';

export function AssetOperationalList({ data, isLoading }: AssetOperationalListProps) {
  const { t } = useTranslation();

  if (isLoading) return <DefaultLoading />;
  if (!data?.length) return <DefaultEmptyData />;

  const sortedData = [...data].sort((a, b) => {
    const isDowntimeA = a.status.includes('downtime');
    const isDowntimeB = b.status.includes('downtime');

    if (isDowntimeA && !isDowntimeB) return -1;
    if (!isDowntimeA && isDowntimeB) return 1;

    if (a.percentualOperating !== b.percentualOperating) {
      return a.percentualOperating - b.percentualOperating;
    }

    return a.machine.name.localeCompare(b.machine.name);
  });

  return (
    <Table>
      <TableHeader className="p-4">
        <TableRow>
          <TableHead className="w-[200px]">{t('last.status')}</TableHead>
          <TableHead>{t('machine')}</TableHead>
          <TableHead className="w-[150px] text-right">{t('perc.title.last.30.days')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedData.map((item, index) => {
          const statusConfig = getIconStatusOperation(item.status);
          const colorStatus = getStatusColor(item.percentualOperating);

          return (
            <TableRow key={`${item.machine.id}-${index}`}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <span className="text-xl">{statusConfig.icon}</span>
                  <div className="flex flex-col">
                    <ItemTitle>{statusConfig.label}</ItemTitle>
                    {item.status?.includes('downtime') && <ItemDescription>{formatDate(item.startedAt, 'dd MMM HH:mm')}</ItemDescription>}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarImage src={item.machine?.image?.url} alt={item.machine?.name} />
                    <AvatarFallback>
                      <Ship className="size-4 text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                  <ItemTitle>{item.machine?.name}</ItemTitle>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div
                  className={cn(
                    'inline-flex min-w-16 justify-center rounded px-2 py-1 font-bold text-xs',
                    colorStatus === 'success' && 'bg-emerald-500/10 text-emerald-600',
                    colorStatus === 'warning' && 'bg-amber-500/10 text-amber-600',
                    colorStatus === 'destructive' && 'bg-rose-500/10 text-rose-600',
                  )}
                >
                  {item.percentualOperating} %
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

interface AssetOperationalListProps {
  data: AssetOperationalRanking[] | undefined;
  isLoading: boolean;
}
