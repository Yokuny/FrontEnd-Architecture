import { useNavigate } from '@tanstack/react-router';
import { Bell, Edit, MoreVertical, Ship, Zap, ZapOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ItemDescription, ItemTitle } from '@/components/ui/item';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { formatDate } from '@/lib/formatDate';
import { cn } from '@/lib/utils';
import type { EquipmentType, HeatmapFleetItem } from '../@interface/heatmap.types';
import { getSubgroupStatus } from '../@utils/heatmap.utils';

const statusColors: Record<StatusVariant, { bg: string; border: string; text: string }> = {
  success: { bg: 'bg-emerald-500', border: 'border-emerald-500', text: 'text-emerald-500' },
  warning: { bg: 'bg-amber-500', border: 'border-amber-500', text: 'text-amber-500' },
  danger: { bg: 'bg-rose-500', border: 'border-rose-500', text: 'text-rose-500' },
  basic: { bg: 'bg-slate-400', border: 'border-slate-400', text: 'text-slate-400' },
};

export function StatusTracker({ items, onItemClick, showLegend }: StatusTrackerProps) {
  const { t } = useTranslation();

  const getStatusLabel = (status: StatusVariant) => {
    switch (status) {
      case 'success':
        return 'OK';
      case 'warning':
        return t('items.in.progress');
      case 'danger':
        return t('items.in.alert');
      case 'basic':
        return t('no.connected.hours', { hours: '24' });
      default:
        return '';
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      {items.map((item, index) => {
        if (!item.status) return null;

        const colors = statusColors[item.status] || statusColors.basic;
        const isClickable = !!onItemClick;
        const label = getStatusLabel(item.status);

        return (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  'h-7 w-4 rounded-sm border-2 transition-all',
                  item.onlyBorder ? `${colors.border} bg-transparent` : `${colors.bg} ${colors.border}`,
                  isClickable && 'cursor-pointer hover:scale-110',
                )}
                onClick={() => onItemClick?.(item, index)}
              />
            </TooltipTrigger>
            <TooltipContent className="flex flex-col gap-1 p-2">
              <div className="flex gap-1.5">
                <ItemDescription>{t('name')}:</ItemDescription>
                <ItemTitle>{item.tooltip}</ItemTitle>
              </div>
              <div className="flex items-center gap-1.5">
                <ItemDescription>{t('legend')}:</ItemDescription>
                <div className="flex items-center gap-1">
                  {item.onlyBorder ? <ZapOff className="size-3 text-slate-300" /> : <Zap className="size-3 fill-emerald-700 text-emerald-500" />}
                  <ItemTitle className="font-medium capitalize">{label}</ItemTitle>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        );
      })}
      {showLegend && items[0]?.tooltip && <ItemDescription className={cn('ml-2 font-medium', statusColors[items[0].status]?.text)}>{items[0].tooltip}</ItemDescription>}
    </div>
  );
}

export function HeatmapTable({ data, availableEquipments }: HeatmapTableProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const sortedData = [...data].sort((a, b) => a.machine.name?.localeCompare(b.machine.name) || 0);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('machine')}</TableHead>
          {availableEquipments.map((equipment) => (
            <TableHead key={equipment.code} className="text-center">
              {equipment.name}
            </TableHead>
          ))}
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedData.map((fleet) => (
          <TableRow key={fleet.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="size-12">
                  <AvatarImage src={fleet.machine.image?.url} alt={fleet.machine.name} />
                  <AvatarFallback>
                    <Ship className="size-4 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <ItemTitle>{fleet.machine.name}</ItemTitle>
                  <ItemDescription>{fleet.lastUpdate ? formatDate(fleet.lastUpdate, 'dd MMM HH:mm') : '-'}</ItemDescription>
                </div>
              </div>
            </TableCell>

            {availableEquipments.map((equipmentType) => {
              const equipment = fleet.equipments.find((eqp) => eqp.code === equipmentType.code);

              if (!equipment) {
                return <TableCell key={equipmentType.code} className="text-center" />;
              }

              const sortedSubgroups = [...equipment.subgroups].sort((a, b) => a.subgroupName.localeCompare(b.subgroupName));

              return (
                <TableCell key={equipmentType.code} className="text-center">
                  <div className="flex justify-center">
                    <StatusTracker
                      items={sortedSubgroups.map((subg) => ({
                        status: getSubgroupStatus(subg, fleet.lastUpdate),
                        tooltip: subg.subgroupName,
                        onlyBorder: !subg.isOn,
                      }))}
                      onItemClick={() => {}}
                    />
                  </div>
                </TableCell>
              );
            })}

            {/* {hasPermissionAdd && ( */}
            <TableCell className="text-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon">
                    <MoreVertical className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate({ to: '/telemetry/heatmap-fleet/add', search: { id: fleet.id } })}>
                    <Edit className="mr-2 size-4" />
                    {t('edit')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate({ to: '/telemetry/heatmap-fleet/notifications', search: { id: fleet.id } })}>
                    <Bell className="mr-2 size-4 text-muted-foreground" />
                    {t('alerts')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
            {/* )} */}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

interface HeatmapTableProps {
  data: HeatmapFleetItem[];
  availableEquipments: EquipmentType[];
}

export type StatusVariant = 'success' | 'warning' | 'danger' | 'basic';

interface StatusTrackerItem {
  status: StatusVariant;
  tooltip?: string;
  onlyBorder?: boolean;
}

interface StatusTrackerProps {
  items: StatusTrackerItem[];
  onItemClick?: (item: StatusTrackerItem, index: number) => void;
  showLegend?: boolean;
}
