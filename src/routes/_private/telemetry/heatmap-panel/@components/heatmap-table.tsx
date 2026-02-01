import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { HeatmapColumn, HeatmapRow, TrackerItem } from '../@interface/heatmap-panel.types';
import { StatusTracker } from './status-tracker';

export function HeatmapTable({ columns, rows, onTrackerItemClick }: HeatmapTableProps) {
  const { t } = useTranslation();

  if (!columns.length || !rows.length) {
    return null;
  }

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-[1280px]">
        <TableHeader>
          <TableRow>
            <TableHead className="sticky left-0 z-10 w-48 bg-background">{t('vessel')}</TableHead>
            {columns.map((col, index) => (
              <TableHead key={index} className="min-w-[50px] max-w-[90px] text-center">
                <div className="break-words font-semibold text-xs">{col.name}</div>
                {col.subgroups?.length ? (
                  <div className="mt-1 text-muted-foreground text-xs">
                    {col.subgroups.map((sub, i) => (
                      <span key={i} className="px-1">
                        {sub.option}
                      </span>
                    ))}
                  </div>
                ) : null}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              <TableCell className="sticky left-0 z-10 w-48 bg-background">
                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarImage src={row.machine.image?.url} alt={row.machine.name} />
                    <AvatarFallback>{row.machine.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-sm">{row.machine.name}</span>
                </div>
              </TableCell>
              {columns.map((col, colIndex) => {
                const dataColumn = row.groups?.find((g) => g.code === col.code);

                if (!dataColumn) {
                  return <TableCell key={colIndex} />;
                }

                const trackerItems: TrackerItem[] =
                  dataColumn.subgroups?.map((subg) => {
                    if (!subg.status) {
                      return { isEmpty: true };
                    }
                    return {
                      status: subg.status,
                      tooltip: subg.name,
                      data: subg,
                      machine: row.machine,
                    };
                  }) || [];

                return (
                  <TableCell key={colIndex} className="text-center">
                    <StatusTracker items={trackerItems} onItemClick={onTrackerItemClick} />
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

interface HeatmapTableProps {
  columns: HeatmapColumn[];
  rows: HeatmapRow[];
  onTrackerItemClick: (item: TrackerItem) => void;
}
