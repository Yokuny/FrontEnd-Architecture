import { useQueryClient } from '@tanstack/react-query';
import { Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { getChartColor } from '@/components/ui/chart';
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import { formatDate } from '@/lib/formatDate';
import type { MonitoringPlanItem as MonitoringPlanItemType } from '../@interface/monitoring-plan.types';
import { EditEventScheduleDialog } from './edit-event-schedule-dialog';

interface MonitoringPlanItemProps {
  planItem: MonitoringPlanItemType;
  idMachine: string;
}

export function MonitoringPlanItem({ planItem, idMachine }: MonitoringPlanItemProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // Color logic based on legacy ItemMonitoringPlan.jsx
  const getStatusColor = () => {
    if (planItem.expired) return getChartColor(8); // Red
    if (planItem.next) return getChartColor(9); // Orange
    if (planItem.warning) return getChartColor(10); // Amber
    if (planItem.daysLeft) return getChartColor(13); // Green
    return 'var(--color-slate-400)';
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['monitoring-plans'] });
  };

  const chartData = [
    { name: 'Progress', value: planItem.percentual },
    { name: 'Remaining', value: Math.max(0, 100 - planItem.percentual) },
  ];

  const statusColor = getStatusColor();

  return (
    <EditEventScheduleDialog idMachine={idMachine} idMaintenancePlan={planItem.idMaintenancePlan} dateWindowEnd={planItem.dateWindowEnd} onSuccess={handleSuccess}>
      <Item variant="outline" className="cursor-pointer bg-secondary p-2 px-4">
        <ItemContent className="flex w-full flex-row items-center justify-between">
          {/* Titulo e status */}
          <div className="flex flex-col gap-2">
            <ItemTitle className="font-medium text-base">{planItem.description}</ItemTitle>
            <div className="flex items-center gap-4">
              <div className="flex shrink-0 gap-1.5">
                {planItem.expired && <Badge className="h-4.5 bg-red-400/80 px-1.5 font-bold text-[9px] uppercase hover:bg-red-400">{t('expired')}</Badge>}
                {planItem.next && !planItem.expired && (
                  <Badge variant="destructive" className="h-4.5 px-1.5 font-bold text-[9px] uppercase">
                    {t('next')}
                  </Badge>
                )}
                {planItem.warning && <Badge className="h-4.5 bg-amber-400/80 px-1.5 font-bold text-[9px] uppercase hover:bg-amber-400">{t('next')}</Badge>}
              </div>

              {planItem.daysLeft !== null && (
                <p className="font-semibold tabular-nums" style={{ color: statusColor }}>
                  {planItem.daysLeft} {t('days')}
                </p>
              )}
            </div>
          </div>

          {/* Data */}
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <ItemDescription className="font-semibold text-lg">{planItem.dateWindowEnd ? formatDate(planItem.dateWindowEnd, 'dd MM yyyy') : '-'}</ItemDescription>
              <div className="flex items-center gap-2">
                <Calendar className="size-4 shrink-0" />
                {t('date.window.end')}
              </div>
            </div>

            <div className="relative size-16 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} innerRadius="75%" outerRadius="100%" startAngle={90} endAngle={-270} paddingAngle={0} dataKey="value">
                    <Cell key="progress" fill={statusColor} stroke="none" />
                    <Cell key="remaining" fill="hsl(var(--muted)/0.2)" stroke="none" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-bold text-[11px] tracking-tighter" style={{ color: statusColor }}>
                  {planItem.percentual}%
                </span>
              </div>
            </div>
          </div>
        </ItemContent>
      </Item>
    </EditEventScheduleDialog>
  );
}
